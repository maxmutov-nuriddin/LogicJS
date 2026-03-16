import { parse } from "@babel/parser";
import type { File } from "@babel/types";

export interface ParseResult {
  ast: File | null;
  error: string | null;
}

export function parseCode(code: string): ParseResult {
  try {
    const ast = parse(code, {
      sourceType: "script",
      plugins: ["jsx"],
      errorRecovery: false,
    });
    return { ast, error: null };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return {
        ast: null,
        error: `Syntax Error: ${err.message}`,
      };
    }
    return {
      ast: null,
      error: "An unknown parse error occurred.",
    };
  }
}
