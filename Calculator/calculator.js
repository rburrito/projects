let entryScreen = document.getElementById("entryScreen");
let button = document.getElementsByTagName("button");
let test = document.getElementById("test");

let numberActionButtons = [];
let e = /[0-9.]/;
for (let i = 0; i < button.length; i++) {
  numberActionButtons.push(button[i]);
}

let operators = /[*/+]/;
let entry = [];
let state = true;

function calculateSentence(array) {
  try {
    return eval(array.join(""));
  } catch (error) {
    state = false;
    return "Error";
  }
}

for (let j = 0; j < numberActionButtons.length; j++) {
  //for
  numberActionButtons[j].addEventListener("click", function(event) {
    if (numberActionButtons[j].value === "AC") {
      entry = [];
      state = true;
      computeMath = [];
      entryScreen.innerHTML = "0";
    } else if (numberActionButtons[j].value == "CE") {
      state = true;
      entry.pop(entry[entry.length - 1]);
      if (entry.length === 0) {
        entryScreen.innerHTML = "0";
      } else {
        entryScreen.innerHTML = entry.join("");
      }
    } else if (numberActionButtons[j].value !== "=" && state !== false) {
      if (
        operators.test(numberActionButtons[j].value) &&
        operators.test(entry[entry.length - 1])
      ) {
        entry[entry.length - 1] = numberActionButtons[j].value;
        entryScreen.innerHTML = entry.join("");
      } else if (
        numberActionButtons[j].value === "." &&
        entry[entry.length - 1] === "."
      ) {
        entryScreen.innerHTML = entry.join("");
      } else {
        entry.push(numberActionButtons[j].value);
        entryScreen.innerHTML = entry.join("");
      }
    } else if (state !== false) {
      // for the equal sign
      if (calculateSentence(entry) !== "Error") {
        entry = [calculateSentence(entry)];
        entryScreen.innerHTML = entry.join("");
      } else {
        entryScreen.innerHTML = "Error";
        entry = [];
      }
    }
  });
}
