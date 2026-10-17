const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let justCalculated = false;

function updateDisplay() {
  display.value = expression
    .replace(/\*/g, " × ")
    .replace(/\//g, " ÷ ")
    .replace(/\+/g, " + ")
    .replace(/-/g, " − ") || "0";
}

function calculate() {
  try {
    if (!expression || !/[0-9]/.test(expression)) return;

    // Only allow calculator characters.
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }

    // Evaluate the mathematical expression.
    const result = Function(
      '"use strict"; return (' + expression + ')'
    )();

    if (!Number.isFinite(result)) {
      throw new Error("Invalid result");
    }

    expression = String(
      Number(result.toPrecision(12))
    );

    updateDisplay();
    justCalculated = true;
  } catch {
    display.value = "Error";
    expression = "";
    justCalculated = true;
  }
}

buttons.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "clear") {
    expression = "";
    justCalculated = false;
    updateDisplay();
    return;
  }

  if (action === "delete") {
    if (justCalculated) {
      expression = "";
      justCalculated = false;
    } else {
      expression = expression.slice(0, -1);
    }
    updateDisplay();
    return;
  }

  if (action === "calculate") {
    calculate();
    return;
  }

  if (action === "sign") {
    if (justCalculated) justCalculated = false;

    if (expression.startsWith("-(") && expression.endsWith(")")) {
      expression = expression.slice(2, -1);
    } else if (expression) {
      expression = "-(" + expression + ")";
    }
    updateDisplay();
    return;
  }

  if (value === undefined) return;

  if (justCalculated) {
    if ("0123456789.".includes(value)) {
      expression = "";
    }
    justCalculated = false;
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/%]/).pop();
    if (currentNumber.includes(".")) return;

    if (!currentNumber) expression += "0";
  }

  expression += value;
  updateDisplay();
});