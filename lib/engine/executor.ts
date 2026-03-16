import * as t from "@babel/types";
import type {
  ExecutionStep,
  RuntimeState,
  ConditionSnapshot,
  DeclareVariableStep,
  AssignVariableStep,
  UpdateVariableStep,
  EvaluateConditionStep,
  EnterIfBranchStep,
  SkipBranchStep,
  ConsoleOutputStep,
  ProgramStartStep,
  ProgramEndStep,
  LoopIterationStep,
  LoopConditionStep,
  LoopEndStep,
  FunctionDeclareStep,
  FunctionCallStep,
  FunctionReturnStep,
  StepLimitStep,
} from "../types";
import type { Lang } from "../i18n";
import { EXPLANATIONS, type ExplanationSet } from "../i18n/explanations";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_STEPS = 500;
const MAX_ITERATIONS = 200;

// ─── Helpers ─────────────────────────────────────────────────────────────────

let stepCounter = 0;
function nextId(): string {
  return `step-${++stepCounter}`;
}

function typeLabel(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

export function formatValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "function") return `f ${(value as { name?: string }).name ?? "()"}()`;
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value
      .slice(0, 5)
      .map((v) => formatValue(v))
      .join(", ");
    return value.length > 5 ? `[${items}, …]` : `[${items}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, 3);
    if (entries.length === 0) return "{}";
    const inner = entries.map(([k, v]) => `${k}: ${formatValue(v)}`).join(", ");
    return `{${inner}${Object.keys(value as object).length > 3 ? ", …" : ""}}`;
  }
  return String(value);
}

function getExprSource(node: t.Node): string {
  if (t.isNumericLiteral(node)) return String(node.value);
  if (t.isStringLiteral(node)) return `"${node.value}"`;
  if (t.isBooleanLiteral(node)) return String(node.value);
  if (t.isNullLiteral(node)) return "null";
  if (t.isIdentifier(node)) return node.name;
  if (t.isUnaryExpression(node))
    return `${node.operator}${getExprSource(node.argument)}`;
  if (t.isBinaryExpression(node))
    return `${getExprSource(node.left as t.Node)} ${node.operator} ${getExprSource(node.right as t.Node)}`;
  if (t.isLogicalExpression(node))
    return `${getExprSource(node.left)} ${node.operator} ${getExprSource(node.right)}`;
  if (t.isMemberExpression(node)) {
    if (node.computed) return `${getExprSource(node.object as t.Node)}[${getExprSource(node.property as t.Node)}]`;
    return `${getExprSource(node.object as t.Node)}.${getExprSource(node.property as t.Node)}`;
  }
  if (t.isCallExpression(node)) return `${getExprSource(node.callee as t.Node)}(...)`;
  if (t.isConditionalExpression(node))
    return `${getExprSource(node.test)} ? ${getExprSource(node.consequent)} : ${getExprSource(node.alternate)}`;
  if (t.isTemplateLiteral(node)) return "`…`";
  if (t.isUpdateExpression(node))
    return node.prefix
      ? `${node.operator}${getExprSource(node.argument)}`
      : `${getExprSource(node.argument)}${node.operator}`;
  if (t.isAssignmentExpression(node))
    return `${getExprSource(node.left as t.Node)} ${node.operator} ${getExprSource(node.right)}`;
  return "[expr]";
}

/** Returns Monaco 1-based column range from a Babel AST node (Babel is 0-based). */
function getCol(node: t.Node): { start: number; end: number; endLine?: number } | undefined {
  if (!node.loc) return undefined;
  const startLine = node.loc.start.line;
  const endLine = node.loc.end.line;
  return {
    start: node.loc.start.column + 1,
    end: node.loc.end.column + 1,
    endLine: endLine !== startLine ? endLine : undefined,
  };
}

function cloneState(state: RuntimeState): RuntimeState {
  return {
    variables: { ...state.variables },
    consoleOutput: [...state.consoleOutput],
    currentLine: state.currentLine,
    activeCondition: state.activeCondition
      ? { ...state.activeCondition }
      : undefined,
    activeBranch: state.activeBranch,
    changedVariable: state.changedVariable,
    callStack: state.callStack ? [...state.callStack] : [],
    loopInfo: state.loopInfo ? { ...state.loopInfo } : null,
  };
}

// ─── Control Flow Signals ─────────────────────────────────────────────────────

class BreakSignal {}
class ContinueSignal {}
class ReturnSignal {
  constructor(public readonly value: unknown) {}
}

// ─── Scope chain ──────────────────────────────────────────────────────────────

class ScopeChain {
  private scopes: Array<Map<string, unknown>> = [new Map()];

  push(): void {
    this.scopes.push(new Map());
  }

  pop(): void {
    if (this.scopes.length > 1) this.scopes.pop();
  }

  declare(name: string, value: unknown): void {
    this.scopes[this.scopes.length - 1].set(name, value);
  }

  get(name: string): unknown {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) return this.scopes[i].get(name);
    }
    return undefined;
  }

  set(name: string, value: unknown): boolean {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) {
        this.scopes[i].set(name, value);
        return true;
      }
    }
    return false;
  }

  flat(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const scope of this.scopes) {
      scope.forEach((v, k) => {
        result[k] = v;
      });
    }
    return result;
  }

  has(name: string): boolean {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) return true;
    }
    return false;
  }
}

// ─── Main Executor ────────────────────────────────────────────────────────────

export class ExecutionEngine {
  private readonly e: ExplanationSet;
  private steps: ExecutionStep[] = [];
  private scope = new ScopeChain();
  private callStack: string[] = [];
  private consoleOutput: string[] = [];
  private currentLine = 0;

  constructor(lang: Lang = "en") {
    this.e = EXPLANATIONS[lang];
  }
  private loopIteration = 0;
  private functions = new Map<string, t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression>();

  private get baseState(): RuntimeState {
    return {
      variables: this.scope.flat(),
      consoleOutput: [...this.consoleOutput],
      currentLine: this.currentLine,
      activeCondition: undefined,
      activeBranch: null,
      changedVariable: undefined,
      callStack: [...this.callStack],
      loopInfo: null,
    };
  }

  private limitReached(): boolean {
    return this.steps.length >= MAX_STEPS;
  }

  private pushStep(step: ExecutionStep): void {
    this.steps.push(step);
  }

  // ─── Public entry point ──────────────────────────────────────────────────

  execute(ast: t.File): ExecutionStep[] {
    stepCounter = 0;
    this.steps = [];
    this.scope = new ScopeChain();
    this.callStack = [];
    this.consoleOutput = [];
    this.currentLine = 0;
    this.loopIteration = 0;
    this.functions = new Map();

    const startStep: ProgramStartStep = {
      id: nextId(),
      type: "program-start",
      line: 1,
      state: cloneState(this.baseState),
      explanation: this.e.programStart(),
    };
    this.pushStep(startStep);

    // First pass: hoist function declarations
    for (const node of ast.program.body) {
      if (t.isFunctionDeclaration(node) && node.id) {
        this.functions.set(node.id.name, node);
      }
    }

    try {
      for (const node of ast.program.body) {
        if (this.limitReached()) {
          this.addLimitStep();
          break;
        }
        this.executeStatement(node);
      }
    } catch (err) {
      if (
        !(err instanceof BreakSignal) &&
        !(err instanceof ContinueSignal) &&
        !(err instanceof ReturnSignal)
      ) {
        const msg = err instanceof Error ? err.message : String(err);
        const errStep: StepLimitStep = {
          id: nextId(),
          type: "step-limit",
          line: this.currentLine,
          state: cloneState(this.baseState),
          explanation: this.e.runtimeError(msg),
        };
        this.pushStep(errStep);
        return this.steps;
      }
    }

    const endStep: ProgramEndStep = {
      id: nextId(),
      type: "program-end",
      line: this.currentLine,
      state: cloneState(this.baseState),
      explanation: this.e.programEnd(),
    };
    this.pushStep(endStep);

    return this.steps;
  }

  private addLimitStep(): void {
    const step: StepLimitStep = {
      id: nextId(),
      type: "step-limit",
      line: this.currentLine,
      state: cloneState(this.baseState),
      explanation: this.e.stepLimit(MAX_STEPS),
    };
    this.pushStep(step);
  }

  // ─── Statement dispatcher ─────────────────────────────────────────────────

  private executeStatement(node: t.Statement): void {
    if (this.limitReached()) return;

    this.currentLine = node.loc?.start.line ?? this.currentLine;

    if (t.isVariableDeclaration(node)) {
      this.executeVariableDeclaration(node);
    } else if (t.isFunctionDeclaration(node)) {
      this.executeFunctionDeclaration(node);
    } else if (t.isExpressionStatement(node)) {
      this.executeExpressionStatement(node);
    } else if (t.isIfStatement(node)) {
      this.executeIfStatement(node);
    } else if (t.isForStatement(node)) {
      this.executeForStatement(node);
    } else if (t.isWhileStatement(node)) {
      this.executeWhileStatement(node);
    } else if (t.isDoWhileStatement(node)) {
      this.executeDoWhileStatement(node);
    } else if (t.isForOfStatement(node)) {
      this.executeForOfStatement(node);
    } else if (t.isForInStatement(node)) {
      this.executeForInStatement(node);
    } else if (t.isReturnStatement(node)) {
      this.executeReturnStatement(node);
    } else if (t.isBlockStatement(node)) {
      this.executeBlock(node);
    } else if (t.isBreakStatement(node)) {
      throw new BreakSignal();
    } else if (t.isContinueStatement(node)) {
      throw new ContinueSignal();
    } else if (t.isSwitchStatement(node)) {
      this.executeSwitchStatement(node);
    }
    // Unknown statement types are silently skipped
  }

  private executeBlock(node: t.BlockStatement): void {
    this.scope.push();
    try {
      for (const stmt of node.body) {
        if (this.limitReached()) break;
        this.executeStatement(stmt);
      }
    } finally {
      this.scope.pop();
    }
  }

  // ─── Variable Declaration ────────────────────────────────────────────────

  private executeVariableDeclaration(node: t.VariableDeclaration): void {
    for (const declarator of node.declarations) {
      if (this.limitReached()) return;
      const line = node.loc?.start.line ?? this.currentLine;
      this.currentLine = line;

      // Destructuring pattern support
      if (t.isArrayPattern(declarator.id) || t.isObjectPattern(declarator.id)) {
        const initValue = declarator.init
          ? this.evalExpr(declarator.init)
          : undefined;
        this.executeDestructuring(declarator.id, initValue, node.kind, line);
        continue;
      }

      if (!t.isIdentifier(declarator.id)) continue;

      const name = declarator.id.name;
      const value = declarator.init ? this.evalExpr(declarator.init) : undefined;

      this.scope.declare(name, value);

      const state = cloneState({
        ...this.baseState,
        changedVariable: name,
        activeBranch: null,
        activeCondition: undefined,
      });

      const step: DeclareVariableStep = {
        id: nextId(),
        type: "declare-variable",
        line,
        col: getCol(declarator),
        name,
        value,
        state,
        explanation:
          value === undefined
            ? this.e.declareVariableUndef(name, node.kind)
            : this.e.declareVariable(name, node.kind, value),
      };
      this.pushStep(step);
    }
  }

  private executeDestructuring(
    pattern: t.ArrayPattern | t.ObjectPattern,
    value: unknown,
    kind: string,
    line: number
  ): void {
    if (t.isArrayPattern(pattern)) {
      const arr = Array.isArray(value) ? value : [];
      pattern.elements.forEach((el, i) => {
        if (!el) return;
        if (t.isIdentifier(el)) {
          const name = el.name;
          const v = arr[i];
          this.scope.declare(name, v);
          const step: DeclareVariableStep = {
            id: nextId(),
            type: "declare-variable",
            line,
            name,
            value: v,
            state: cloneState({ ...this.baseState, changedVariable: name }),
            explanation: this.e.destructureArray(name, i, v),
          };
          this.pushStep(step);
        }
      });
    } else if (t.isObjectPattern(pattern)) {
      const obj = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
      for (const prop of pattern.properties) {
        if (t.isRestElement(prop)) continue;
        if (t.isObjectProperty(prop)) {
          const keyName = t.isIdentifier(prop.key) ? prop.key.name : "";
          const localName = t.isIdentifier(prop.value) ? prop.value.name : keyName;
          const v = obj[keyName];
          this.scope.declare(localName, v);
          const step: DeclareVariableStep = {
            id: nextId(),
            type: "declare-variable",
            line,
            name: localName,
            value: v,
            state: cloneState({ ...this.baseState, changedVariable: localName }),
            explanation: this.e.destructureObject(localName, keyName, v),
          };
          this.pushStep(step);
        }
      }
    }
  }

  // ─── Function Declaration ────────────────────────────────────────────────

  private executeFunctionDeclaration(node: t.FunctionDeclaration): void {
    if (!node.id) return;
    const name = node.id.name;
    const params = node.params
      .filter(t.isIdentifier)
      .map((p) => (p as t.Identifier).name);
    const line = node.loc?.start.line ?? this.currentLine;

    // Already hoisted, just emit the step
    const step: FunctionDeclareStep = {
      id: nextId(),
      type: "function-declare",
      line,
      name,
      params,
      state: cloneState(this.baseState),
      explanation: this.e.functionDeclare(name, params),
    };
    this.pushStep(step);
  }

  // ─── Expression Statement ────────────────────────────────────────────────

  private executeExpressionStatement(node: t.ExpressionStatement): void {
    const expr = node.expression;
    const line = node.loc?.start.line ?? this.currentLine;
    this.currentLine = line;

    if (t.isAssignmentExpression(expr)) {
      this.executeAssignment(expr, line);
    } else if (t.isUpdateExpression(expr)) {
      this.executeUpdate(expr, line);
    } else if (t.isCallExpression(expr)) {
      this.evalCallExpression(expr, line);
    } else if (t.isSequenceExpression(expr)) {
      for (const e of expr.expressions) {
        this.evalExpr(e);
      }
    }
  }

  private executeAssignment(node: t.AssignmentExpression, line: number): void {
    // Handle member expression assignment: arr[i] = x, obj.prop = x
    if (t.isMemberExpression(node.left)) {
      const memberNode = node.left as t.MemberExpression;
      const obj = this.evalExpr(memberNode.object as t.Expression);
      const prop = memberNode.computed
        ? this.evalExpr(memberNode.property as t.Expression)
        : (memberNode.property as t.Identifier).name;
      const rhs = this.evalExpr(node.right);
      if (typeof obj === "object" && obj !== null) {
        (obj as Record<string | number, unknown>)[prop as string | number] = rhs;
        const name = getExprSource(node.left);
        const state = cloneState({ ...this.baseState, changedVariable: name });
        const step: AssignVariableStep = {
          id: nextId(),
          type: "assign-variable",
          line,
          name,
          oldValue: undefined,
          value: rhs,
          state,
          explanation: this.e.memberAssign(name, rhs),
        };
        this.pushStep(step);
      }
      return;
    }

    if (!t.isIdentifier(node.left)) return;

    const name = node.left.name;
    const oldValue = this.scope.get(name);
    const rhs = this.evalExpr(node.right);

    let finalValue: unknown;
    switch (node.operator) {
      case "=":   finalValue = rhs; break;
      case "+=":  finalValue = (oldValue as number) + (rhs as number); break;
      case "-=":  finalValue = (oldValue as number) - (rhs as number); break;
      case "*=":  finalValue = (oldValue as number) * (rhs as number); break;
      case "/=":  finalValue = (oldValue as number) / (rhs as number); break;
      case "%=":  finalValue = (oldValue as number) % (rhs as number); break;
      case "**=": finalValue = (oldValue as number) ** (rhs as number); break;
      case "&&=": finalValue = oldValue && rhs; break;
      case "||=": finalValue = oldValue || rhs; break;
      default:    finalValue = rhs;
    }

    if (!this.scope.set(name, finalValue)) {
      this.scope.declare(name, finalValue);
    }

    const state = cloneState({
      ...this.baseState,
      changedVariable: name,
      activeBranch: null,
    });

    const step: AssignVariableStep = {
      id: nextId(),
      type: "assign-variable",
      line,
      col: getCol(node),
      name,
      oldValue,
      value: finalValue,
      state,
      explanation:
        node.operator === "="
          ? this.e.assignVariable(name, oldValue, finalValue)
          : this.e.assignVariableOp(name, node.operator, oldValue, rhs, finalValue),
    };
    this.pushStep(step);
  }

  private executeUpdate(node: t.UpdateExpression, line: number): void {
    if (!t.isIdentifier(node.argument)) return;
    const name = node.argument.name;
    const oldValue = this.scope.get(name) as number;
    const newValue = node.operator === "++" ? oldValue + 1 : oldValue - 1;

    this.scope.set(name, newValue);

    const state = cloneState({ ...this.baseState, changedVariable: name });
    const step: UpdateVariableStep = {
      id: nextId(),
      type: "update-variable",
      line,
      col: getCol(node),
      name,
      operator: node.operator as "++" | "--",
      prefix: node.prefix,
      oldValue,
      newValue,
      state,
      explanation: this.e.updateVariable(name, node.operator, oldValue, newValue),
    };
    this.pushStep(step);
  }

  // ─── If Statement ────────────────────────────────────────────────────────

  private executeIfStatement(node: t.IfStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    this.currentLine = line;

    const condSource = getExprSource(node.test);
    const condResult = Boolean(this.evalExpr(node.test as t.Expression));

    let leftValue: unknown;
    let rightValue: unknown;
    let operator = "";

    if (t.isBinaryExpression(node.test) || t.isLogicalExpression(node.test)) {
      leftValue = this.evalExpr(
        (node.test as t.BinaryExpression | t.LogicalExpression).left as t.Expression
      );
      rightValue = this.evalExpr(
        (node.test as t.BinaryExpression | t.LogicalExpression).right as t.Expression
      );
      operator = (node.test as t.BinaryExpression).operator;
    }

    const condition: ConditionSnapshot = {
      expression: condSource,
      leftValue,
      rightValue,
      operator,
      result: condResult,
    };

    const condStep: EvaluateConditionStep = {
      id: nextId(),
      type: "evaluate-condition",
      line,
      col: getCol(node.test),
      expression: condSource,
      leftValue,
      rightValue,
      operator,
      result: condResult,
      state: cloneState({ ...this.baseState, activeCondition: condition, activeBranch: null }),
      explanation:
        leftValue !== undefined
          ? this.e.evaluateCondition(condSource, leftValue, rightValue, condResult)
          : this.e.evaluateConditionSimple(condSource, condResult),
    };
    this.pushStep(condStep);

    if (condResult) {
      const enterStep: EnterIfBranchStep = {
        id: nextId(),
        type: "enter-if-branch",
        line,
        branch: "if",
        state: cloneState({ ...this.baseState, activeCondition: condition, activeBranch: "if" }),
        explanation: this.e.enterIf(),
      };
      this.pushStep(enterStep);

      if (t.isBlockStatement(node.consequent)) {
        this.executeBlock(node.consequent);
      } else {
        this.executeStatement(node.consequent);
      }

      if (node.alternate) {
        const skipStep: SkipBranchStep = {
          id: nextId(),
          type: "skip-branch",
          line,
          branch: "else",
          state: cloneState({ ...this.baseState, activeCondition: condition, activeBranch: "else" }),
          explanation: this.e.skipElse(),
        };
        this.pushStep(skipStep);
      }
    } else {
      const skipIfStep: SkipBranchStep = {
        id: nextId(),
        type: "skip-branch",
        line,
        branch: "if",
        state: cloneState({ ...this.baseState, activeCondition: condition, activeBranch: "if" }),
        explanation: this.e.skipIf(),
      };
      this.pushStep(skipIfStep);

      if (node.alternate) {
        if (t.isIfStatement(node.alternate)) {
          // else if chain
          const enterElseIfStep: EnterIfBranchStep = {
            id: nextId(),
            type: "enter-if-branch",
            line,
            branch: "else",
            state: cloneState({ ...this.baseState, activeCondition: condition, activeBranch: "else" }),
            explanation: this.e.elseIfCheck(),
          };
          this.pushStep(enterElseIfStep);
          this.executeIfStatement(node.alternate);
        } else {
          const enterElseStep: EnterIfBranchStep = {
            id: nextId(),
            type: "enter-if-branch",
            line,
            branch: "else",
            state: cloneState({ ...this.baseState, activeCondition: condition, activeBranch: "else" }),
            explanation: this.e.enterElse(),
          };
          this.pushStep(enterElseStep);

          if (t.isBlockStatement(node.alternate)) {
            this.executeBlock(node.alternate);
          } else {
            this.executeStatement(node.alternate);
          }
        }
      }
    }
  }

  // ─── For Statement ───────────────────────────────────────────────────────

  private executeForStatement(node: t.ForStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    this.currentLine = line;

    this.scope.push();
    try {
      // Init
      if (node.init) {
        if (t.isVariableDeclaration(node.init)) {
          this.executeVariableDeclaration(node.init);
        } else if (t.isExpression(node.init)) {
          this.evalExpr(node.init);
        }
      }

      let iteration = 0;

      while (true) {
        if (this.limitReached()) { this.addLimitStep(); break; }
        if (iteration >= MAX_ITERATIONS) {
          const limitStep: StepLimitStep = {
            id: nextId(),
            type: "step-limit",
            line,
            state: cloneState(this.baseState),
            explanation: this.e.stepLimitLoop(MAX_ITERATIONS),
          };
          this.pushStep(limitStep);
          break;
        }

        // Test
        if (node.test) {
          const condSource = getExprSource(node.test);
          const condResult = Boolean(this.evalExpr(node.test as t.Expression));

          const condStep: LoopConditionStep = {
            id: nextId(),
            type: "loop-condition",
            line,
            col: getCol(node.test),
            expression: condSource,
            result: condResult,
            iteration,
            state: cloneState(this.baseState),
            explanation: condResult
              ? this.e.forLoopConditionTrue(condSource, iteration)
              : this.e.forLoopConditionFalse(condSource, iteration),
          };
          this.pushStep(condStep);

          if (!condResult) break;
        }

        iteration++;

        const iterStep: LoopIterationStep = {
          id: nextId(),
          type: "loop-iteration",
          loopType: "for",
          iteration,
          line,
          state: cloneState({ ...this.baseState, loopInfo: { iteration } }),
          explanation: this.e.forLoopIteration(iteration),
        };
        this.pushStep(iterStep);

        // Body
        try {
          if (t.isBlockStatement(node.body)) {
            this.scope.push();
            for (const stmt of node.body.body) {
              if (this.limitReached()) break;
              this.executeStatement(stmt);
            }
            this.scope.pop();
          } else {
            this.executeStatement(node.body);
          }
        } catch (e) {
          if (e instanceof BreakSignal) break;
          if (e instanceof ContinueSignal) { /* continue to update */ }
          else throw e;
        }

        // Update
        if (node.update) {
          if (t.isUpdateExpression(node.update) && t.isIdentifier(node.update.argument)) {
            this.executeUpdate(node.update, line);
          } else {
            this.evalExpr(node.update);
          }
        }
      }

      const endStep: LoopEndStep = {
        id: nextId(),
        type: "loop-end",
        loopType: "for",
        totalIterations: iteration,
        line,
        state: cloneState(this.baseState),
        explanation: this.e.forLoopEnd(iteration),
      };
      this.pushStep(endStep);
    } finally {
      this.scope.pop();
    }
  }

  // ─── While Statement ─────────────────────────────────────────────────────

  private executeWhileStatement(node: t.WhileStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    this.currentLine = line;
    let iteration = 0;

    while (true) {
      if (this.limitReached()) { this.addLimitStep(); break; }
      if (iteration >= MAX_ITERATIONS) {
        const limitStep: StepLimitStep = {
          id: nextId(),
          type: "step-limit",
          line,
          state: cloneState(this.baseState),
          explanation: this.e.stepLimitLoop(MAX_ITERATIONS),
        };
        this.pushStep(limitStep);
        break;
      }

      const condSource = getExprSource(node.test);
      const condResult = Boolean(this.evalExpr(node.test as t.Expression));

      const condStep: LoopConditionStep = {
        id: nextId(),
        type: "loop-condition",
        line,
        col: getCol(node.test),
        expression: condSource,
        result: condResult,
        iteration,
        state: cloneState(this.baseState),
        explanation: condResult
          ? this.e.whileConditionTrue(condSource, iteration)
          : this.e.whileConditionFalse(condSource, iteration),
      };
      this.pushStep(condStep);

      if (!condResult) break;

      iteration++;

      const iterStep: LoopIterationStep = {
        id: nextId(),
        type: "loop-iteration",
        loopType: "while",
        iteration,
        line,
        state: cloneState({ ...this.baseState, loopInfo: { iteration } }),
        explanation: this.e.whileIteration(iteration),
      };
      this.pushStep(iterStep);

      try {
        if (t.isBlockStatement(node.body)) {
          this.executeBlock(node.body);
        } else {
          this.executeStatement(node.body);
        }
      } catch (e) {
        if (e instanceof BreakSignal) break;
        if (e instanceof ContinueSignal) continue;
        throw e;
      }
    }

    const endStep: LoopEndStep = {
      id: nextId(),
      type: "loop-end",
      loopType: "while",
      totalIterations: iteration,
      line,
      state: cloneState(this.baseState),
      explanation: this.e.whileEnd(iteration),
    };
    this.pushStep(endStep);
  }

  // ─── Do-While Statement ──────────────────────────────────────────────────

  private executeDoWhileStatement(node: t.DoWhileStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    this.currentLine = line;
    let iteration = 0;

    do {
      if (this.limitReached()) { this.addLimitStep(); break; }
      if (iteration >= MAX_ITERATIONS) {
        this.addLimitStep();
        break;
      }

      iteration++;

      const iterStep: LoopIterationStep = {
        id: nextId(),
        type: "loop-iteration",
        loopType: "do-while",
        iteration,
        line,
        state: cloneState({ ...this.baseState, loopInfo: { iteration } }),
        explanation: this.e.doWhileIteration(iteration),
      };
      this.pushStep(iterStep);

      try {
        if (t.isBlockStatement(node.body)) {
          this.executeBlock(node.body);
        } else {
          this.executeStatement(node.body);
        }
      } catch (e) {
        if (e instanceof BreakSignal) break;
        if (e instanceof ContinueSignal) { /* fall through to test */ }
        else throw e;
      }

      const condSource = getExprSource(node.test);
      const condResult = Boolean(this.evalExpr(node.test as t.Expression));

      const condStep: LoopConditionStep = {
        id: nextId(),
        type: "loop-condition",
        line,
        expression: condSource,
        result: condResult,
        iteration,
        state: cloneState(this.baseState),
        explanation: condResult
          ? this.e.doWhileConditionTrue(condSource)
          : this.e.doWhileConditionFalse(condSource, iteration),
      };
      this.pushStep(condStep);

      if (!condResult) break;
    } while (true);

    const endStep: LoopEndStep = {
      id: nextId(),
      type: "loop-end",
      loopType: "do-while",
      totalIterations: iteration,
      line,
      state: cloneState(this.baseState),
      explanation: this.e.doWhileEnd(iteration),
    };
    this.pushStep(endStep);
  }

  // ─── For-Of / For-In ─────────────────────────────────────────────────────

  private executeForOfStatement(node: t.ForOfStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    this.currentLine = line;

    const iterable = this.evalExpr(node.right as t.Expression);
    const items = Array.isArray(iterable)
      ? iterable
      : typeof iterable === "string"
      ? iterable.split("")
      : [];

    let iteration = 0;

    for (const item of items) {
      if (this.limitReached()) { this.addLimitStep(); break; }
      iteration++;

      // Bind loop variable
      this.scope.push();
      if (t.isVariableDeclaration(node.left)) {
        const decl = node.left.declarations[0];
        if (t.isIdentifier(decl.id)) {
          const name = decl.id.name;
          this.scope.declare(name, item);

          const step: DeclareVariableStep = {
            id: nextId(),
            type: "declare-variable",
            line,
            name,
            value: item,
            state: cloneState({ ...this.baseState, changedVariable: name }),
            explanation: this.e.forOfIteration(iteration, item),
          };
          this.pushStep(step);
        }
      }

      const iterStep: LoopIterationStep = {
        id: nextId(),
        type: "loop-iteration",
        loopType: "for-of",
        iteration,
        line,
        state: cloneState({ ...this.baseState, loopInfo: { iteration } }),
        explanation: this.e.forOfIteration(iteration, item),
      };
      this.pushStep(iterStep);

      try {
        if (t.isBlockStatement(node.body)) {
          for (const stmt of node.body.body) {
            if (this.limitReached()) break;
            this.executeStatement(stmt);
          }
        } else {
          this.executeStatement(node.body);
        }
      } catch (e) {
        this.scope.pop();
        if (e instanceof BreakSignal) break;
        if (e instanceof ContinueSignal) { this.scope.push(); continue; }
        throw e;
      }

      this.scope.pop();
    }

    const endStep: LoopEndStep = {
      id: nextId(),
      type: "loop-end",
      loopType: "for-of",
      totalIterations: iteration,
      line,
      state: cloneState(this.baseState),
      explanation: this.e.forOfEnd(iteration),
    };
    this.pushStep(endStep);
  }

  private executeForInStatement(node: t.ForInStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    this.currentLine = line;

    const obj = this.evalExpr(node.right as t.Expression);
    const keys =
      typeof obj === "object" && obj !== null ? Object.keys(obj as object) : [];

    let iteration = 0;

    for (const key of keys) {
      if (this.limitReached()) { this.addLimitStep(); break; }
      iteration++;

      this.scope.push();
      if (t.isVariableDeclaration(node.left)) {
        const decl = node.left.declarations[0];
        if (t.isIdentifier(decl.id)) {
          const name = decl.id.name;
          this.scope.declare(name, key);

          const step: DeclareVariableStep = {
            id: nextId(),
            type: "declare-variable",
            line,
            name,
            value: key,
            state: cloneState({ ...this.baseState, changedVariable: name }),
            explanation: this.e.forInIteration(key),
          };
          this.pushStep(step);
        }
      }

      const iterStep: LoopIterationStep = {
        id: nextId(),
        type: "loop-iteration",
        loopType: "for-in",
        iteration,
        line,
        state: cloneState({ ...this.baseState, loopInfo: { iteration } }),
        explanation: this.e.forInIteration(key),
      };
      this.pushStep(iterStep);

      try {
        if (t.isBlockStatement(node.body)) {
          for (const stmt of node.body.body) {
            if (this.limitReached()) break;
            this.executeStatement(stmt);
          }
        } else {
          this.executeStatement(node.body);
        }
      } catch (e) {
        this.scope.pop();
        if (e instanceof BreakSignal) break;
        if (e instanceof ContinueSignal) { this.scope.push(); continue; }
        throw e;
      }

      this.scope.pop();
    }

    const endStep: LoopEndStep = {
      id: nextId(),
      type: "loop-end",
      loopType: "for-in",
      totalIterations: iteration,
      line,
      state: cloneState(this.baseState),
      explanation: this.e.forInEnd(iteration),
    };
    this.pushStep(endStep);
  }

  // ─── Return Statement ────────────────────────────────────────────────────

  private executeReturnStatement(node: t.ReturnStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    const value = node.argument ? this.evalExpr(node.argument) : undefined;
    throw new ReturnSignal(value);
  }

  // ─── Switch Statement ────────────────────────────────────────────────────

  private executeSwitchStatement(node: t.SwitchStatement): void {
    const line = node.loc?.start.line ?? this.currentLine;
    const discriminant = this.evalExpr(node.discriminant);
    let matched = false;

    for (const caseNode of node.cases) {
      if (this.limitReached()) break;

      if (!matched) {
        if (caseNode.test === null) {
          // default case
          matched = true;
        } else {
          const testVal = this.evalExpr(caseNode.test as t.Expression);
          const condResult = discriminant === testVal;

          const condStep: EvaluateConditionStep = {
            id: nextId(),
            type: "evaluate-condition",
            line: caseNode.loc?.start.line ?? line,
            expression: `${formatValue(discriminant)} === ${formatValue(testVal)}`,
            leftValue: discriminant,
            rightValue: testVal,
            operator: "===",
            result: condResult,
            state: cloneState(this.baseState),
            explanation: this.e.switchCheck(discriminant, testVal, condResult),
          };
          this.pushStep(condStep);

          if (condResult) matched = true;
        }
      }

      if (matched) {
        try {
          for (const stmt of caseNode.consequent) {
            if (this.limitReached()) break;
            this.executeStatement(stmt);
          }
        } catch (e) {
          if (e instanceof BreakSignal) return;
          throw e;
        }
      }
    }
  }

  // ─── Function calls ──────────────────────────────────────────────────────

  private evalCallExpression(node: t.CallExpression, line: number): unknown {
    this.currentLine = line;

    // console.log / console.warn / console.error
    if (
      t.isMemberExpression(node.callee) &&
      t.isIdentifier(node.callee.object) &&
      node.callee.object.name === "console" &&
      t.isIdentifier(node.callee.property)
    ) {
      const args = node.arguments.map((a) => this.evalExpr(a as t.Expression));
      const output = args.map(formatValue).join(" ");
      this.consoleOutput = [...this.consoleOutput, output];

      const step: ConsoleOutputStep = {
        id: nextId(),
        type: "console-output",
        line,
        col: getCol(node),
        value: output,
        state: cloneState({ ...this.baseState, activeCondition: undefined }),
        explanation: this.e.consoleOutput(output, (node.callee.property as t.Identifier).name),
      };
      this.pushStep(step);
      return undefined;
    }

    // Named function call
    if (t.isIdentifier(node.callee)) {
      const fnName = node.callee.name;
      const args = node.arguments.map((a) => this.evalExpr(a as t.Expression));

      // Built-in Math functions
      if (fnName === "Math" || this.isMathMethod(node.callee)) {
        return this.evalExpr(node);
      }

      const fn = this.functions.get(fnName);
      if (fn) {
        return this.invokeFunction(fnName, fn, args, line, getCol(node));
      }

      // Unknown function: just skip silently
      return undefined;
    }

    // Method call: arr.push(), obj.method(), etc.
    if (t.isMemberExpression(node.callee)) {
      return this.evalMemberCall(node);
    }

    return undefined;
  }

  private isMathMethod(node: t.Identifier): boolean {
    return ["Math"].includes(node.name);
  }

  private invokeFunction(
    name: string,
    fn: t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression,
    args: unknown[],
    line: number,
    callCol?: { start: number; end: number; endLine?: number }
  ): unknown {
    const params = fn.params
      .filter(t.isIdentifier)
      .map((p) => (p as t.Identifier).name);

    const callStep: FunctionCallStep = {
      id: nextId(),
      type: "function-call",
      line,
      col: callCol,
      name,
      args,
      params,
      state: cloneState(this.baseState),
      explanation: this.e.functionCall(name, args),
    };
    this.pushStep(callStep);

    // New scope for function
    this.callStack = [...this.callStack, name];
    this.scope.push();

    // Bind parameters
    params.forEach((pName, i) => {
      this.scope.declare(pName, args[i]);
      const pStep: DeclareVariableStep = {
        id: nextId(),
        type: "declare-variable",
        line: fn.loc?.start.line ?? line,
        name: pName,
        value: args[i],
        state: cloneState({ ...this.baseState, changedVariable: pName }),
        explanation: this.e.functionParam(pName, args[i]),
      };
      this.pushStep(pStep);
    });

    let returnValue: unknown = undefined;

    try {
      const body = t.isBlockStatement(fn.body)
        ? fn.body.body
        : [t.returnStatement(fn.body as t.Expression)];

      for (const stmt of body) {
        if (this.limitReached()) break;
        this.executeStatement(stmt);
      }
    } catch (e) {
      if (e instanceof ReturnSignal) {
        returnValue = e.value;
      } else {
        throw e;
      }
    }

    this.scope.pop();
    this.callStack = this.callStack.slice(0, -1);

    const returnStep: FunctionReturnStep = {
      id: nextId(),
      type: "function-return",
      line,
      name,
      value: returnValue,
      state: cloneState(this.baseState),
      explanation:
        returnValue === undefined
          ? this.e.functionReturnVoid(name)
          : this.e.functionReturn(name, returnValue),
    };
    this.pushStep(returnStep);

    return returnValue;
  }

  // ─── Expression Evaluator ─────────────────────────────────────────────────

  evalExpr(node: t.Expression | t.SpreadElement | t.ArgumentPlaceholder | t.JSXNamespacedName): unknown {
    if (t.isNumericLiteral(node)) return node.value;
    if (t.isStringLiteral(node)) return node.value;
    if (t.isBooleanLiteral(node)) return node.value;
    if (t.isNullLiteral(node)) return null;
    if (t.isIdentifier(node)) {
      if (node.name === "undefined") return undefined;
      if (node.name === "Infinity") return Infinity;
      if (node.name === "NaN") return NaN;
      return this.scope.get(node.name);
    }

    if (t.isTemplateLiteral(node)) {
      let result = "";
      for (let i = 0; i < node.quasis.length; i++) {
        result += node.quasis[i].value.cooked ?? "";
        if (i < node.expressions.length) {
          const expr = node.expressions[i];
          if (t.isExpression(expr)) result += String(this.evalExpr(expr));
        }
      }
      return result;
    }

    if (t.isUnaryExpression(node)) {
      const val = this.evalExpr(node.argument);
      switch (node.operator) {
        case "!": return !val;
        case "-": return -(val as number);
        case "+": return +(val as number);
        case "typeof": return typeof val;
        case "void": return undefined;
      }
    }

    if (t.isUpdateExpression(node)) {
      if (!t.isIdentifier(node.argument)) return undefined;
      const name = node.argument.name;
      const oldVal = this.scope.get(name) as number;
      const newVal = node.operator === "++" ? oldVal + 1 : oldVal - 1;
      this.scope.set(name, newVal);
      return node.prefix ? newVal : oldVal;
    }

    if (t.isBinaryExpression(node)) {
      const left = this.evalExpr(node.left as t.Expression);
      const right = this.evalExpr(node.right as t.Expression);
      switch (node.operator) {
        case "+":   return (left as number) + (right as number);
        case "-":   return (left as number) - (right as number);
        case "*":   return (left as number) * (right as number);
        case "/":   return (left as number) / (right as number);
        case "%":   return (left as number) % (right as number);
        case "**":  return (left as number) ** (right as number);
        case ">":   return (left as number) > (right as number);
        case "<":   return (left as number) < (right as number);
        case ">=":  return (left as number) >= (right as number);
        case "<=":  return (left as number) <= (right as number);
        case "===": return left === right;
        case "!==": return left !== right;
        case "==":  return left == right; // eslint-disable-line eqeqeq
        case "!=":  return left != right; // eslint-disable-line eqeqeq
        case "&":   return (left as number) & (right as number);
        case "|":   return (left as number) | (right as number);
        case "^":   return (left as number) ^ (right as number);
        case "<<":  return (left as number) << (right as number);
        case ">>":  return (left as number) >> (right as number);
        case ">>>": return (left as number) >>> (right as number);
        case "instanceof": return (left as object) instanceof (right as { new(): object });
        case "in":  return right != null && (left as string) in (right as object);
      }
    }

    if (t.isLogicalExpression(node)) {
      const left = this.evalExpr(node.left);
      if (node.operator === "&&") return left ? this.evalExpr(node.right) : left;
      if (node.operator === "||") return left ? left : this.evalExpr(node.right);
      if (node.operator === "??") return left != null ? left : this.evalExpr(node.right);
    }

    if (t.isConditionalExpression(node)) {
      const test = this.evalExpr(node.test);
      return test ? this.evalExpr(node.consequent) : this.evalExpr(node.alternate);
    }

    if (t.isAssignmentExpression(node)) {
      const rhs = this.evalExpr(node.right);
      if (t.isIdentifier(node.left)) {
        const name = node.left.name;
        const oldVal = this.scope.get(name);
        let finalVal: unknown;
        switch (node.operator) {
          case "=":   finalVal = rhs; break;
          case "+=":  finalVal = (oldVal as number) + (rhs as number); break;
          case "-=":  finalVal = (oldVal as number) - (rhs as number); break;
          case "*=":  finalVal = (oldVal as number) * (rhs as number); break;
          case "/=":  finalVal = (oldVal as number) / (rhs as number); break;
          default:    finalVal = rhs;
        }
        if (!this.scope.set(name, finalVal)) this.scope.declare(name, finalVal);
        return finalVal;
      }
      if (t.isMemberExpression(node.left)) {
        const ml = node.left as t.MemberExpression;
        const obj = this.evalExpr(ml.object as t.Expression);
        const prop = ml.computed
          ? this.evalExpr(ml.property as t.Expression)
          : (ml.property as t.Identifier).name;
        if (typeof obj === "object" && obj !== null) {
          (obj as Record<string | number, unknown>)[prop as string | number] = rhs;
        }
        return rhs;
      }
      return rhs;
    }

    if (t.isSequenceExpression(node)) {
      let last: unknown = undefined;
      for (const expr of node.expressions) last = this.evalExpr(expr);
      return last;
    }

    if (t.isArrayExpression(node)) {
      return node.elements.map((el) => {
        if (!el) return undefined;
        if (t.isSpreadElement(el)) {
          const val = this.evalExpr(el.argument);
          return val;
        }
        return this.evalExpr(el as t.Expression);
      }).flat();
    }

    if (t.isObjectExpression(node)) {
      const obj: Record<string, unknown> = {};
      for (const prop of node.properties) {
        if (t.isObjectProperty(prop)) {
          const keyName = t.isIdentifier(prop.key)
            ? prop.key.name
            : t.isStringLiteral(prop.key)
            ? prop.key.value
            : String(this.evalExpr(prop.key as t.Expression));
          const val = this.evalExpr(prop.value as t.Expression);
          obj[keyName] = val;
        }
        if (t.isSpreadElement(prop)) {
          const spread = this.evalExpr(prop.argument);
          if (typeof spread === "object" && spread !== null) {
            Object.assign(obj, spread);
          }
        }
      }
      return obj;
    }

    if (t.isMemberExpression(node)) {
      return this.evalMemberExpression(node);
    }

    if (t.isCallExpression(node)) {
      return this.evalCallExpression(node, node.loc?.start.line ?? this.currentLine);
    }

    if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node)) {
      // Return a reference to the function
      const fn = node;
      const self = this;
      const closure = function (...args: unknown[]) {
        return self.invokeFunction("(anonymous)", fn, args, self.currentLine);
      };
      return closure;
    }

    if (t.isNewExpression(node)) {
      // Basic support: new Array(n), new Object(), etc.
      if (t.isIdentifier(node.callee)) {
        const name = node.callee.name;
        const args = node.arguments.map((a) => this.evalExpr(a as t.Expression));
        if (name === "Array") return new Array(args[0] as number);
        if (name === "Object") return {};
        if (name === "Map") return new Map();
        if (name === "Set") return new Set(args[0] as unknown[]);
      }
    }

    return undefined;
  }

  private evalMemberExpression(node: t.MemberExpression): unknown {
    const obj = this.evalExpr(node.object as t.Expression);
    const prop = node.computed
      ? this.evalExpr(node.property as t.Expression)
      : (node.property as t.Identifier).name;

    if (obj === null || obj === undefined) return undefined;

    // Array methods and properties
    if (Array.isArray(obj)) {
      if (prop === "length") return obj.length;
      if (prop === "push") return (...args: unknown[]) => { obj.push(...args); return obj.length; };
      if (prop === "pop") return () => obj.pop();
      if (prop === "shift") return () => obj.shift();
      if (prop === "unshift") return (...args: unknown[]) => { obj.unshift(...args); return obj.length; };
      if (prop === "includes") return (v: unknown) => obj.includes(v);
      if (prop === "indexOf") return (v: unknown) => obj.indexOf(v);
      if (prop === "join") return (sep?: string) => obj.join(sep);
      if (prop === "slice") return (a?: number, b?: number) => obj.slice(a, b);
      if (prop === "concat") return (...args: unknown[][]) => obj.concat(...args);
      if (prop === "reverse") return () => obj.reverse();
      if (prop === "sort") return () => obj.sort();
      if (prop === "find") return (fn: (v: unknown) => boolean) => obj.find(fn);
      if (prop === "findIndex") return (fn: (v: unknown) => boolean) => obj.findIndex(fn);
      if (prop === "some") return (fn: (v: unknown) => boolean) => obj.some(fn);
      if (prop === "every") return (fn: (v: unknown) => boolean) => obj.every(fn);
      if (prop === "flat") return (depth?: number) => obj.flat(depth);
      if (prop === "flatMap") return (fn: (v: unknown) => unknown) => obj.flatMap(fn);
      if (prop === "fill") return (v: unknown, a?: number, b?: number) => obj.fill(v, a, b);
      if (prop === "map")
        return (fn: (v: unknown, i: number) => unknown) => obj.map(fn);
      if (prop === "filter")
        return (fn: (v: unknown) => boolean) => obj.filter(fn);
      if (prop === "reduce")
        return (fn: (acc: unknown, v: unknown) => unknown, init?: unknown) =>
          obj.reduce(fn, init);
      if (prop === "forEach")
        return (fn: (v: unknown, i: number) => void) => obj.forEach(fn);
      if (typeof prop === "number" || (typeof prop === "string" && !isNaN(Number(prop)))) {
        return obj[Number(prop)];
      }
    }

    // String methods
    if (typeof obj === "string") {
      if (prop === "length") return obj.length;
      if (prop === "toUpperCase") return () => obj.toUpperCase();
      if (prop === "toLowerCase") return () => obj.toLowerCase();
      if (prop === "trim") return () => obj.trim();
      if (prop === "includes") return (s: string) => obj.includes(s);
      if (prop === "startsWith") return (s: string) => obj.startsWith(s);
      if (prop === "endsWith") return (s: string) => obj.endsWith(s);
      if (prop === "indexOf") return (s: string) => obj.indexOf(s);
      if (prop === "slice") return (a?: number, b?: number) => obj.slice(a, b);
      if (prop === "substring") return (a: number, b?: number) => obj.substring(a, b);
      if (prop === "split") return (sep: string) => obj.split(sep);
      if (prop === "replace") return (a: string | RegExp, b: string) => obj.replace(a, b);
      if (prop === "repeat") return (n: number) => obj.repeat(n);
      if (prop === "padStart") return (n: number, s: string) => obj.padStart(n, s);
      if (prop === "padEnd") return (n: number, s: string) => obj.padEnd(n, s);
      if (prop === "charAt") return (i: number) => obj.charAt(i);
      if (prop === "charCodeAt") return (i: number) => obj.charCodeAt(i);
      if (typeof prop === "number" || (typeof prop === "string" && !isNaN(Number(prop)))) {
        return obj[Number(prop)];
      }
    }

    // Number methods
    if (typeof obj === "number") {
      if (prop === "toFixed") return (n: number) => obj.toFixed(n);
      if (prop === "toString") return (radix?: number) => obj.toString(radix);
      if (prop === "toLocaleString") return () => obj.toLocaleString();
    }

    // Math object
    if (typeof obj === "object" && obj !== null && "abs" in (obj as object)) {
      return (obj as Record<string, unknown>)[prop as string];
    }

    // Generic object property access
    if (typeof obj === "object" && obj !== null) {
      return (obj as Record<string, unknown>)[prop as string];
    }

    return undefined;
  }

  private evalMemberCall(node: t.CallExpression): unknown {
    if (!t.isMemberExpression(node.callee)) return undefined;
    const method = this.evalMemberExpression(node.callee);
    if (typeof method !== "function") return undefined;

    const args = node.arguments.map((a) => {
      if (t.isSpreadElement(a)) {
        const val = this.evalExpr(a.argument);
        return Array.isArray(val) ? val : [val];
      }
      return this.evalExpr(a as t.Expression);
    });

    // Flatten spread args
    const flatArgs: unknown[] = [];
    node.arguments.forEach((a, i) => {
      if (t.isSpreadElement(a)) {
        const val = args[i];
        if (Array.isArray(val)) flatArgs.push(...val);
        else flatArgs.push(val);
      } else {
        flatArgs.push(args[i]);
      }
    });

    // Execute built-in method
    return (method as (...a: unknown[]) => unknown)(...flatArgs);
  }
}
