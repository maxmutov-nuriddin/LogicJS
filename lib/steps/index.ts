import { parseCode } from "../parser";
import { ExecutionEngine } from "../engine/executor";
import type { ExecutionStep } from "../types";
import type { Lang } from "../i18n";

export interface RunResult {
  steps: ExecutionStep[];
  error: string | null;
}

export function runCode(code: string, lang: Lang = "en"): RunResult {
  const { ast, error } = parseCode(code);

  if (error || !ast) {
    return { steps: [], error: error ?? "Failed to parse code." };
  }

  try {
    const engine = new ExecutionEngine(lang);
    const steps = engine.execute(ast);
    return { steps, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown execution error.";
    return { steps: [], error: `Execution Error: ${message}` };
  }
}

// ─── Code Presets ─────────────────────────────────────────────────────────────

export const CODE_PRESETS: Record<string, { label: string; code: string }> = {
  basic_if: {
    label: "If / Else",
    code: `let a = 5;

if (a > 3) {
  console.log("big");
} else {
  console.log("small");
}`,
  },

  for_loop: {
    label: "For Loop",
    code: `let sum = 0;

for (let i = 1; i <= 5; i++) {
  sum = sum + i;
  console.log("i =", i, "sum =", sum);
}

console.log("Total:", sum);`,
  },

  while_loop: {
    label: "While Loop",
    code: `let count = 10;
let result = 1;

while (count > 0) {
  result = result * 2;
  count = count - 1;
}

console.log("Result:", result);`,
  },

  functions: {
    label: "Functions",
    code: `function add(a, b) {
  let result = a + b;
  return result;
}

function greet(name) {
  console.log("Hello, " + name + "!");
}

let x = add(3, 7);
console.log("Sum:", x);
greet("Alex");`,
  },

  arrays: {
    label: "Arrays",
    code: `let fruits = ["apple", "banana", "cherry"];

console.log("Length:", fruits.length);
console.log("First:", fruits[0]);

fruits.push("mango");
console.log("After push:", fruits.length);

for (let i = 0; i < fruits.length; i++) {
  console.log(i, "->", fruits[i]);
}`,
  },

  objects: {
    label: "Objects",
    code: `let person = {
  name: "Alice",
  age: 25,
  city: "Tashkent"
};

console.log(person.name);
console.log(person.age);

person.age = 26;
console.log("Birthday! Now:", person.age);`,
  },

  nested_if: {
    label: "Nested If",
    code: `let score = 75;
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 75) {
  grade = "B";
} else if (score >= 60) {
  grade = "C";
} else {
  grade = "F";
}

console.log("Grade:", grade);`,
  },

  fibonacci: {
    label: "Fibonacci",
    code: `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i <= 7; i++) {
  let fib = fibonacci(i);
  console.log("fib(" + i + ") =", fib);
}`,
  },
};

export const DEFAULT_CODE = CODE_PRESETS.basic_if.code;
