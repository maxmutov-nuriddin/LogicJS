# LogicJS — JavaScript Execution Visualizer

A web platform that teaches students how JavaScript works internally by visualizing code execution step by step.

## Features

- **Step-by-step execution** — Walk through code one statement at a time
- **Memory visualization** — See variables appear, with values and types highlighted on change
- **Condition evaluation** — Visual breakdown of `left operator right = result`
- **Flow diagrams** — If/else branch paths shown visually; skipped paths marked
- **Console output** — Terminal-style live output panel
- **Step explanations** — Plain-English description of each execution step
- **Timeline** — Scrollable horizontal timeline of all steps; click any to jump
- **Auto-play mode** — Watch the full execution animate automatically
- **Code presets** — 5 built-in examples to explore

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| AST Parser | `@babel/parser` + `@babel/types` |
| State | Zustand |
| Icons | Lucide React |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

## Project Structure

```
/app
  layout.tsx              # Root layout + metadata
  globals.css             # Global styles + dark theme
  page.tsx                # Landing page (hero, features)
  /playground
    page.tsx              # Main playground UI (3 panels)
    store.ts              # Zustand state management

/components
  /editor
    CodeEditor.tsx        # Monaco editor with line highlighting
    EditorControls.tsx    # Run/Step/Reset/Play controls + presets
  /visualizer
    MainVisualizer.tsx    # Orchestrates all visualizer panels
    VariableView.tsx      # Animated variable memory boxes
    ConditionView.tsx     # Left/operator/right condition breakdown
    FlowView.tsx          # SVG-based if/else flow diagram
    ConsoleOutput.tsx     # Terminal-style output panel
  /timeline
    Timeline.tsx          # Horizontal step timeline with icons
  /layout
    ExplanationPanel.tsx  # Right panel: step type + explanation
    AutoPlayController.tsx # Headless auto-play timer controller
  /ui
    Button.tsx            # Reusable button with variants
    Card.tsx              # Reusable card container
    Badge.tsx             # Inline type badge

/lib
  /types
    index.ts              # All TypeScript types (ExecutionStep, etc.)
  /parser
    index.ts              # @babel/parser wrapper
  /engine
    executor.ts           # Tree-walking interpreter + step emitter
  /steps
    index.ts              # runCode() entry point + code presets
```

## Architecture

```
User code (Monaco)
  → @babel/parser → AST (File node)
  → ExecutionEngine.execute(ast)
      walks AST nodes, simulates runtime
      emits ExecutionStep[] with state snapshots
  → Zustand store (steps[], currentStepIndex)
  → React components read current step
      VariableView  ← step.state.variables
      ConditionView ← step.state.activeCondition
      FlowView      ← step.state.activeBranch
      ConsoleOutput ← step.state.consoleOutput
      ExplanationPanel ← step.explanation
      Timeline      ← all steps[]
```

## Supported JavaScript (MVP)

| Feature | Status |
|---|---|
| `let` / `const` declarations | ✅ |
| Variable assignment (`=`, `+=`, `-=`, etc.) | ✅ |
| Numbers, strings, booleans | ✅ |
| Binary expressions (`>`, `<`, `===`, `+`, `-`, etc.) | ✅ |
| `if` / `else` statements | ✅ |
| `console.log()` | ✅ |
| Template literals | ✅ |
| Logical expressions (`&&`, `\|\|`) | ✅ |
| `for` loops | 🔜 |
| Functions | 🔜 |
| Arrays / Objects | 🔜 |

## Suggested Next Improvements

1. **For loops** — add `ForStatement` support in executor with loop-unrolling steps
2. **While loops** — same approach with iteration counter
3. **Function declarations & calls** — call stack visualization, scope panels
4. **Arrays** — array memory visualization with index slots
5. **Objects** — property map visualization
6. **Scope visualization** — show local vs global scope
7. **Error runtime highlighting** — highlight exactly which line threw
8. **Share via URL** — encode code in URL params
9. **Lesson mode** — guided exercises with hints
10. **Speed control** — slider to adjust auto-play speed
