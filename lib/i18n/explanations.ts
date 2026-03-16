import type { Lang } from "./index";
import { formatValue } from "../engine/executor";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExplanationSet {
  programStart(): string;
  programEnd(): string;
  declareVariable(name: string, kind: string, value: unknown): string;
  declareVariableUndef(name: string, kind: string): string;
  assignVariable(name: string, oldValue: unknown, newValue: unknown): string;
  assignVariableOp(name: string, op: string, oldValue: unknown, rhs: unknown, newValue: unknown): string;
  updateVariable(name: string, op: string, oldValue: unknown, newValue: unknown): string;
  evaluateCondition(expr: string, left: unknown, right: unknown, result: boolean): string;
  evaluateConditionSimple(expr: string, result: boolean): string;
  enterIf(): string;
  enterElse(): string;
  skipIf(): string;
  skipElse(): string;
  consoleOutput(value: string, method: string): string;
  forLoopConditionTrue(expr: string, iteration: number): string;
  forLoopConditionFalse(expr: string, iteration: number): string;
  forLoopIteration(iteration: number): string;
  forLoopEnd(iteration: number): string;
  whileConditionTrue(expr: string, iteration: number): string;
  whileConditionFalse(expr: string, iteration: number): string;
  whileIteration(iteration: number): string;
  whileEnd(iteration: number): string;
  doWhileIteration(iteration: number): string;
  doWhileConditionTrue(expr: string): string;
  doWhileConditionFalse(expr: string, iteration: number): string;
  doWhileEnd(iteration: number): string;
  forOfIteration(iteration: number, item: unknown): string;
  forOfEnd(iteration: number): string;
  forInIteration(key: string): string;
  forInEnd(iteration: number): string;
  destructureArray(name: string, index: number, value: unknown): string;
  destructureObject(name: string, key: string, value: unknown): string;
  functionDeclare(name: string, params: string[]): string;
  functionCall(name: string, args: unknown[]): string;
  functionParam(name: string, value: unknown): string;
  functionReturn(name: string, value: unknown): string;
  functionReturnVoid(name: string): string;
  stepLimit(max: number): string;
  stepLimitLoop(max: number): string;
  runtimeError(msg: string): string;
  memberAssign(name: string, value: unknown): string;
  switchCheck(discriminant: unknown, testVal: unknown, match: boolean): string;
  elseIfCheck(): string;
}

// ─── English ──────────────────────────────────────────────────────────────────

const en: ExplanationSet = {
  programStart: () =>
    "Program starts. JavaScript begins executing your code from top to bottom.",
  programEnd: () =>
    "Program has finished executing. All statements have been processed.",

  declareVariable: (name, kind, value) =>
    `Variable \`${name}\` is created with \`${kind}\` and assigned the value ${formatValue(value)} (${typeof value}).`,
  declareVariableUndef: (name, kind) =>
    `Variable \`${name}\` is declared with \`${kind}\` but not yet assigned a value — it is \`undefined\`.`,

  assignVariable: (name, oldValue, newValue) =>
    `Variable \`${name}\` is reassigned. Old value: ${formatValue(oldValue)} → New value: ${formatValue(newValue)}.`,
  assignVariableOp: (name, op, oldValue, rhs, newValue) =>
    `Variable \`${name}\` is updated using \`${op}\`: ${formatValue(oldValue)} ${op} ${formatValue(rhs)} = ${formatValue(newValue)}.`,

  updateVariable: (name, op, oldValue, newValue) =>
    `\`${name}${op}\` — \`${name}\` changes from ${formatValue(oldValue)} to ${formatValue(newValue)}.`,

  evaluateCondition: (expr, left, right, result) =>
    `Condition \`${expr}\` is evaluated. Left: ${formatValue(left)}, Right: ${formatValue(right)}. Result: ${result ? "TRUE" : "FALSE"} → the ${result ? "if" : "else"} block will execute.`,
  evaluateConditionSimple: (expr, result) =>
    `Condition \`${expr}\` is evaluated → ${result ? "TRUE" : "FALSE"}. The ${result ? "if" : "else"} block will execute.`,

  enterIf: () =>
    "Condition is TRUE → entering the `if` block and executing statements inside it.",
  enterElse: () =>
    "Condition is FALSE → entering the `else` block.",
  skipIf: () =>
    "Condition is FALSE → the `if` block is skipped entirely.",
  skipElse: () =>
    "Condition was TRUE → the `else` block is skipped.",

  consoleOutput: (value, method) =>
    `\`console.${method}\` is called. It prints ${value} to the console.`,

  forLoopConditionTrue: (expr, iteration) =>
    `Loop condition \`${expr}\` is TRUE (iteration ${iteration + 1}) → execute the loop body.`,
  forLoopConditionFalse: (expr, iteration) =>
    `Loop condition \`${expr}\` is FALSE → loop ends after ${iteration} iteration${iteration !== 1 ? "s" : ""}.`,
  forLoopIteration: (iteration) =>
    `Iteration ${iteration}: executing the loop body.`,
  forLoopEnd: (iteration) =>
    `For loop finished after ${iteration} iteration${iteration !== 1 ? "s" : ""}.`,

  whileConditionTrue: (expr, iteration) =>
    `While condition \`${expr}\` is TRUE (iteration ${iteration + 1}) → run loop body.`,
  whileConditionFalse: (expr, iteration) =>
    `While condition \`${expr}\` is FALSE → loop ends after ${iteration} iteration${iteration !== 1 ? "s" : ""}.`,
  whileIteration: (iteration) =>
    `Iteration ${iteration}: executing the while body.`,
  whileEnd: (iteration) =>
    `While loop finished after ${iteration} iteration${iteration !== 1 ? "s" : ""}.`,

  doWhileIteration: (iteration) =>
    `Do-while iteration ${iteration}: executing the body first (condition checked after).`,
  doWhileConditionTrue: (expr) =>
    `Do-while condition \`${expr}\` is TRUE → repeat the loop.`,
  doWhileConditionFalse: (expr, iteration) =>
    `Do-while condition \`${expr}\` is FALSE → loop ends after ${iteration} iteration${iteration !== 1 ? "s" : ""}.`,
  doWhileEnd: (iteration) =>
    `Do-while loop finished after ${iteration} iteration${iteration !== 1 ? "s" : ""}.`,

  forOfIteration: (iteration, item) =>
    `For-of: processing item ${iteration} → ${formatValue(item)}.`,
  forOfEnd: (iteration) =>
    `For-of loop finished — processed ${iteration} item${iteration !== 1 ? "s" : ""}.`,

  forInIteration: (key) =>
    `For-in: iterating key "${key}".`,
  forInEnd: (iteration) =>
    `For-in loop finished — iterated ${iteration} key${iteration !== 1 ? "s" : ""}.`,

  destructureArray: (name, index, value) =>
    `Destructuring: \`${name}\` gets index [${index}] of the array → ${formatValue(value)}.`,
  destructureObject: (name, key, value) =>
    `Destructuring: \`${name}\` gets property \`${key}\` from object → ${formatValue(value)}.`,

  functionDeclare: (name, params) =>
    `Function \`${name}\` is defined with ${params.length === 0 ? "no parameters" : `parameter${params.length > 1 ? "s" : ""}: ${params.map((p) => `\`${p}\``).join(", ")}`}. It will run when called.`,
  functionCall: (name, args) =>
    `Calling function \`${name}(${args.map(formatValue).join(", ")})\`. Jumping into the function body.`,
  functionParam: (name, value) =>
    `Parameter \`${name}\` receives argument ${formatValue(value)}.`,
  functionReturn: (name, value) =>
    `Function \`${name}\` returns ${formatValue(value)}.`,
  functionReturnVoid: (name) =>
    `Function \`${name}\` finished (no return value).`,

  stepLimit: (max) =>
    `Step limit (${max}) reached. This may be an infinite loop. Execution stopped.`,
  stepLimitLoop: (max) =>
    `Loop exceeded ${max} iterations. Stopped to prevent infinite loop.`,
  runtimeError: (msg) =>
    `Runtime error: ${msg}`,

  memberAssign: (name, value) =>
    `\`${name}\` is set to ${formatValue(value)}.`,
  switchCheck: (discriminant, testVal, match) =>
    `Switch: checking case ${formatValue(testVal)} — ${match ? "MATCH found!" : "no match, checking next case."}`,
  elseIfCheck: () =>
    "Checking the `else if` condition…",
};

// ─── Uzbek ────────────────────────────────────────────────────────────────────

const uz: ExplanationSet = {
  programStart: () =>
    "Dastur boshlanmoqda. JavaScript kodni yuqoridan pastga qarab bajarishni boshlaydi.",
  programEnd: () =>
    "Dastur muvaffaqiyatli tugadi. Barcha buyruqlar bajarildi.",

  declareVariable: (name, kind, value) =>
    `\`${name}\` o'zgaruvchisi \`${kind}\` kalit so'zi bilan yaratildi va unga ${formatValue(value)} qiymati berildi (${typeof value} turi).`,
  declareVariableUndef: (name, kind) =>
    `\`${name}\` o'zgaruvchisi \`${kind}\` bilan e'lon qilindi, lekin hali qiymat berilmadi — \`undefined\` holda turadi.`,

  assignVariable: (name, oldValue, newValue) =>
    `\`${name}\` o'zgaruvchisiga yangi qiymat berildi. Avvalgi: ${formatValue(oldValue)} → Yangi: ${formatValue(newValue)}.`,
  assignVariableOp: (name, op, oldValue, rhs, newValue) =>
    `\`${name}\` o'zgaruvchisi \`${op}\` amali bilan yangilandi: ${formatValue(oldValue)} ${op} ${formatValue(rhs)} = ${formatValue(newValue)}.`,

  updateVariable: (name, op, oldValue, newValue) =>
    `\`${name}${op}\` — \`${name}\` qiymati ${formatValue(oldValue)} dan ${formatValue(newValue)} ga o'zgardi.`,

  evaluateCondition: (expr, left, right, result) =>
    `\`${expr}\` sharti tekshirilmoqda. Chap: ${formatValue(left)}, O'ng: ${formatValue(right)}. Natija: ${result ? "TO'G'RI" : "NOTO'G'RI"} → ${result ? "if" : "else"} bloki bajariladi.`,
  evaluateConditionSimple: (expr, result) =>
    `\`${expr}\` sharti tekshirildi → ${result ? "TO'G'RI" : "NOTO'G'RI"}. ${result ? "if" : "else"} bloki bajariladi.`,

  enterIf: () =>
    "Shart TO'G'RI → \`if\` blokiga kirish va ichidagi buyruqlarni bajarish.",
  enterElse: () =>
    "Shart NOTO'G'RI → \`else\` blokiga kirish.",
  skipIf: () =>
    "Shart NOTO'G'RI → \`if\` bloki butunlay o'tkazib yuboriladi.",
  skipElse: () =>
    "Shart TO'G'RI bo'lgan → \`else\` bloki o'tkazib yuboriladi.",

  consoleOutput: (value, method) =>
    `\`console.${method}\` chaqirildi. ${value} konsolga chiqarildi.`,

  forLoopConditionTrue: (expr, iteration) =>
    `Tsikl sharti \`${expr}\` TO'G'RI (${iteration + 1}-iteratsiya) → tsikl tanasi bajariladi.`,
  forLoopConditionFalse: (expr, iteration) =>
    `Tsikl sharti \`${expr}\` NOTO'G'RI → tsikl ${iteration} ta iteratsiyadan so'ng tugadi.`,
  forLoopIteration: (iteration) =>
    `${iteration}-iteratsiya: tsikl tanasi bajarilmoqda.`,
  forLoopEnd: (iteration) =>
    `For tsikli ${iteration} ta iteratsiyadan so'ng tugadi.`,

  whileConditionTrue: (expr, iteration) =>
    `While sharti \`${expr}\` TO'G'RI (${iteration + 1}-iteratsiya) → tanasi bajariladi.`,
  whileConditionFalse: (expr, iteration) =>
    `While sharti \`${expr}\` NOTO'G'RI → tsikl ${iteration} ta iteratsiyadan so'ng tugadi.`,
  whileIteration: (iteration) =>
    `${iteration}-iteratsiya: while tanasi bajarilmoqda.`,
  whileEnd: (iteration) =>
    `While tsikli ${iteration} ta iteratsiyadan so'ng tugadi.`,

  doWhileIteration: (iteration) =>
    `Do-while ${iteration}-iteratsiyasi: avval tana bajariladi, shart keyin tekshiriladi.`,
  doWhileConditionTrue: (expr) =>
    `Do-while sharti \`${expr}\` TO'G'RI → tsikl takrorlanadi.`,
  doWhileConditionFalse: (expr, iteration) =>
    `Do-while sharti \`${expr}\` NOTO'G'RI → tsikl ${iteration} ta iteratsiyadan so'ng tugadi.`,
  doWhileEnd: (iteration) =>
    `Do-while tsikli ${iteration} ta iteratsiyadan so'ng tugadi.`,

  forOfIteration: (iteration, item) =>
    `For-of: ${iteration}-element → ${formatValue(item)}.`,
  forOfEnd: (iteration) =>
    `For-of tsikli tugadi — ${iteration} ta element qayta ishlandi.`,

  forInIteration: (key) =>
    `For-in: "${key}" kalitini ko'rib chiqilmoqda.`,
  forInEnd: (iteration) =>
    `For-in tsikli tugadi — ${iteration} ta kalit ko'rib chiqildi.`,

  destructureArray: (name, index, value) =>
    `Destrukturizatsiya: \`${name}\` massivning [${index}]-elementini oldi → ${formatValue(value)}.`,
  destructureObject: (name, key, value) =>
    `Destrukturizatsiya: \`${name}\` obyektning \`${key}\` xususiyatini oldi → ${formatValue(value)}.`,

  functionDeclare: (name, params) =>
    `\`${name}\` funksiyasi aniqlandi. ${params.length === 0 ? "Parametrsiz." : `Parametrlar: ${params.map((p) => `\`${p}\``).join(", ")}.`} Chaqirilganda ishlaydi.`,
  functionCall: (name, args) =>
    `\`${name}(${args.map(formatValue).join(", ")})\` funksiyasi chaqirilmoqda. Funksiya tanasiga o'tilmoqda.`,
  functionParam: (name, value) =>
    `\`${name}\` parametri ${formatValue(value)} argumentini qabul qildi.`,
  functionReturn: (name, value) =>
    `\`${name}\` funksiyasi ${formatValue(value)} qiymatini qaytarmoqda.`,
  functionReturnVoid: (name) =>
    `\`${name}\` funksiyasi tugadi (qaytarish qiymati yo'q).`,

  stepLimit: (max) =>
    `Qadam limiti (${max}) ga yetildi. Bu cheksiz tsikl bo'lishi mumkin. Bajarish to'xtatildi.`,
  stepLimitLoop: (max) =>
    `Tsikl ${max} ta iteratsiyadan oshdi. Cheksiz tsiklning oldini olish uchun to'xtatildi.`,
  runtimeError: (msg) =>
    `Ish vaqti xatosi: ${msg}`,

  memberAssign: (name, value) =>
    `\`${name}\` ga ${formatValue(value)} qiymati berildi.`,
  switchCheck: (discriminant, testVal, match) =>
    `Switch: ${formatValue(testVal)} holatini tekshirish — ${match ? "MOSLIK topildi!" : "mos kelmadi, keyingisini tekshirish."}`,
  elseIfCheck: () =>
    "`else if` sharti tekshirilmoqda…",
};

// ─── Russian ──────────────────────────────────────────────────────────────────

const ru: ExplanationSet = {
  programStart: () =>
    "Программа запущена. JavaScript начинает выполнять код сверху вниз.",
  programEnd: () =>
    "Программа завершила выполнение. Все инструкции обработаны.",

  declareVariable: (name, kind, value) =>
    `Переменная \`${name}\` создана с \`${kind}\` и ей присвоено значение ${formatValue(value)} (тип: ${typeof value}).`,
  declareVariableUndef: (name, kind) =>
    `Переменная \`${name}\` объявлена с \`${kind}\`, но значение ещё не присвоено — она равна \`undefined\`.`,

  assignVariable: (name, oldValue, newValue) =>
    `Переменной \`${name}\` присваивается новое значение. Было: ${formatValue(oldValue)} → Стало: ${formatValue(newValue)}.`,
  assignVariableOp: (name, op, oldValue, rhs, newValue) =>
    `Переменная \`${name}\` обновлена оператором \`${op}\`: ${formatValue(oldValue)} ${op} ${formatValue(rhs)} = ${formatValue(newValue)}.`,

  updateVariable: (name, op, oldValue, newValue) =>
    `\`${name}${op}\` — значение \`${name}\` изменилось с ${formatValue(oldValue)} на ${formatValue(newValue)}.`,

  evaluateCondition: (expr, left, right, result) =>
    `Вычисляется условие \`${expr}\`. Левое: ${formatValue(left)}, Правое: ${formatValue(right)}. Результат: ${result ? "ИСТИНА" : "ЛОЖЬ"} → выполнится блок ${result ? "if" : "else"}.`,
  evaluateConditionSimple: (expr, result) =>
    `Условие \`${expr}\` вычислено → ${result ? "ИСТИНА" : "ЛОЖЬ"}. Выполнится блок ${result ? "if" : "else"}.`,

  enterIf: () =>
    "Условие ИСТИНА → входим в блок `if` и выполняем инструкции внутри.",
  enterElse: () =>
    "Условие ЛОЖЬ → входим в блок `else`.",
  skipIf: () =>
    "Условие ЛОЖЬ → блок `if` полностью пропускается.",
  skipElse: () =>
    "Условие было ИСТИНА → блок `else` пропускается.",

  consoleOutput: (value, method) =>
    `Вызван \`console.${method}\`. В консоль выведено: ${value}.`,

  forLoopConditionTrue: (expr, iteration) =>
    `Условие цикла \`${expr}\` — ИСТИНА (итерация ${iteration + 1}) → выполняем тело цикла.`,
  forLoopConditionFalse: (expr, iteration) =>
    `Условие цикла \`${expr}\` — ЛОЖЬ → цикл завершается после ${iteration} итерации.`,
  forLoopIteration: (iteration) =>
    `Итерация ${iteration}: выполняем тело цикла.`,
  forLoopEnd: (iteration) =>
    `Цикл for завершился после ${iteration} итерации.`,

  whileConditionTrue: (expr, iteration) =>
    `Условие while \`${expr}\` — ИСТИНА (итерация ${iteration + 1}) → выполняем тело.`,
  whileConditionFalse: (expr, iteration) =>
    `Условие while \`${expr}\` — ЛОЖЬ → цикл завершается после ${iteration} итерации.`,
  whileIteration: (iteration) =>
    `Итерация ${iteration}: выполняем тело while.`,
  whileEnd: (iteration) =>
    `Цикл while завершился после ${iteration} итерации.`,

  doWhileIteration: (iteration) =>
    `Do-while итерация ${iteration}: сначала выполняем тело (условие проверяется после).`,
  doWhileConditionTrue: (expr) =>
    `Условие do-while \`${expr}\` — ИСТИНА → цикл повторяется.`,
  doWhileConditionFalse: (expr, iteration) =>
    `Условие do-while \`${expr}\` — ЛОЖЬ → цикл завершается после ${iteration} итерации.`,
  doWhileEnd: (iteration) =>
    `Цикл do-while завершился после ${iteration} итерации.`,

  forOfIteration: (iteration, item) =>
    `For-of: обрабатываем элемент ${iteration} → ${formatValue(item)}.`,
  forOfEnd: (iteration) =>
    `Цикл for-of завершён — обработано ${iteration} элементов.`,

  forInIteration: (key) =>
    `For-in: перебирается ключ "${key}".`,
  forInEnd: (iteration) =>
    `Цикл for-in завершён — перебрано ${iteration} ключей.`,

  destructureArray: (name, index, value) =>
    `Деструктуризация: \`${name}\` получает элемент [${index}] массива → ${formatValue(value)}.`,
  destructureObject: (name, key, value) =>
    `Деструктуризация: \`${name}\` получает свойство \`${key}\` объекта → ${formatValue(value)}.`,

  functionDeclare: (name, params) =>
    `Определена функция \`${name}\`. ${params.length === 0 ? "Без параметров." : `Параметры: ${params.map((p) => `\`${p}\``).join(", ")}.`} Запустится при вызове.`,
  functionCall: (name, args) =>
    `Вызывается функция \`${name}(${args.map(formatValue).join(", ")})\`. Переходим в тело функции.`,
  functionParam: (name, value) =>
    `Параметр \`${name}\` получает аргумент ${formatValue(value)}.`,
  functionReturn: (name, value) =>
    `Функция \`${name}\` возвращает ${formatValue(value)}.`,
  functionReturnVoid: (name) =>
    `Функция \`${name}\` завершилась (без возвращаемого значения).`,

  stepLimit: (max) =>
    `Достигнут лимит шагов (${max}). Возможно бесконечный цикл. Выполнение остановлено.`,
  stepLimitLoop: (max) =>
    `Цикл превысил ${max} итераций. Остановлен для предотвращения бесконечного цикла.`,
  runtimeError: (msg) =>
    `Ошибка выполнения: ${msg}`,

  memberAssign: (name, value) =>
    `\`${name}\` установлено значение ${formatValue(value)}.`,
  switchCheck: (discriminant, testVal, match) =>
    `Switch: проверяем case ${formatValue(testVal)} — ${match ? "СОВПАДЕНИЕ найдено!" : "не совпадает, проверяем следующий."}`,
  elseIfCheck: () =>
    "Проверяем условие `else if`…",
};

export const EXPLANATIONS: Record<Lang, ExplanationSet> = { en, uz, ru };
