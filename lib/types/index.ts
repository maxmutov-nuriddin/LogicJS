// ─── Runtime State ────────────────────────────────────────────────────────────

export interface ConditionSnapshot {
  expression: string;
  leftValue: unknown;
  rightValue: unknown;
  operator: string;
  result: boolean;
}

export interface RuntimeState {
  variables: Record<string, unknown>;
  consoleOutput: string[];
  currentLine: number;
  activeCondition?: ConditionSnapshot;
  activeBranch?: "if" | "else" | null;
  changedVariable?: string;
  callStack?: string[];
  loopInfo?: { iteration: number; label?: string } | null;
}

// ─── Execution Steps ──────────────────────────────────────────────────────────

export interface BaseStep {
  id: string;
  line: number;
  /** Monaco 1-based columns for the specific token/expression being executed */
  col?: { start: number; end: number; endLine?: number };
  state: RuntimeState;
}

export interface DeclareVariableStep extends BaseStep {
  type: "declare-variable";
  name: string;
  value: unknown;
  explanation: string;
}

export interface AssignVariableStep extends BaseStep {
  type: "assign-variable";
  name: string;
  oldValue: unknown;
  value: unknown;
  explanation: string;
}

export interface UpdateVariableStep extends BaseStep {
  type: "update-variable";
  name: string;
  operator: "++" | "--";
  prefix: boolean;
  oldValue: unknown;
  newValue: unknown;
  explanation: string;
}

export interface EvaluateConditionStep extends BaseStep {
  type: "evaluate-condition";
  expression: string;
  leftValue: unknown;
  rightValue: unknown;
  operator: string;
  result: boolean;
  explanation: string;
}

export interface EnterIfBranchStep extends BaseStep {
  type: "enter-if-branch";
  branch: "if" | "else";
  explanation: string;
}

export interface SkipBranchStep extends BaseStep {
  type: "skip-branch";
  branch: "if" | "else";
  explanation: string;
}

export interface ConsoleOutputStep extends BaseStep {
  type: "console-output";
  value: string;
  explanation: string;
}

export interface ProgramStartStep extends BaseStep {
  type: "program-start";
  explanation: string;
}

export interface ProgramEndStep extends BaseStep {
  type: "program-end";
  explanation: string;
}

export interface LoopIterationStep extends BaseStep {
  type: "loop-iteration";
  loopType: "for" | "while" | "do-while" | "for-of" | "for-in";
  iteration: number;
  explanation: string;
}

export interface LoopConditionStep extends BaseStep {
  type: "loop-condition";
  expression: string;
  result: boolean;
  iteration: number;
  explanation: string;
}

export interface LoopEndStep extends BaseStep {
  type: "loop-end";
  loopType: string;
  totalIterations: number;
  explanation: string;
}

export interface FunctionDeclareStep extends BaseStep {
  type: "function-declare";
  name: string;
  params: string[];
  explanation: string;
}

export interface FunctionCallStep extends BaseStep {
  type: "function-call";
  name: string;
  args: unknown[];
  params: string[];
  explanation: string;
}

export interface FunctionReturnStep extends BaseStep {
  type: "function-return";
  name: string;
  value: unknown;
  explanation: string;
}

export interface StepLimitStep extends BaseStep {
  type: "step-limit";
  explanation: string;
}

export type ExecutionStep =
  | DeclareVariableStep
  | AssignVariableStep
  | UpdateVariableStep
  | EvaluateConditionStep
  | EnterIfBranchStep
  | SkipBranchStep
  | ConsoleOutputStep
  | ProgramStartStep
  | ProgramEndStep
  | LoopIterationStep
  | LoopConditionStep
  | LoopEndStep
  | FunctionDeclareStep
  | FunctionCallStep
  | FunctionReturnStep
  | StepLimitStep;

// ─── Store Types ─────────────────────────────────────────────────────────────

export type PlaygroundStatus =
  | "idle"
  | "running"
  | "paused"
  | "complete"
  | "error";

export interface PlaygroundStore {
  code: string;
  steps: ExecutionStep[];
  currentStepIndex: number;
  status: PlaygroundStatus;
  errorMessage: string | null;
  isAutoPlaying: boolean;
  autoPlaySpeed: number;

  setCode: (code: string) => void;
  setAutoPlaySpeed: (speed: number) => void;
  runCode: () => void;
  resetPlayground: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  goToStep: (index: number) => void;
  startAutoPlay: () => void;
  stopAutoPlay: () => void;
}
