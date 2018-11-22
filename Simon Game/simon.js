let greenButton = document.getElementById("green");
let redButton = document.getElementById("red");
let yellowButton = document.getElementById("yellow");
let blueButton = document.getElementById("blue");
let onButton = document.getElementById("on");
let offButton = document.getElementById("off");
let startButton = document.getElementById("start");
let strictButton = document.getElementById("strict");
let strictOnLight = document.getElementById("strictOn");
let countDisplay = document.getElementById("count");
let audio1 = document.getElementById("clip1");
let audio2 = document.getElementById("clip2");
let audio3 = document.getElementById("clip3");
let audio4 = document.getElementById("clip4");
let victoryDisplay = document.getElementById("victory");

onButton.addEventListener("click", function(event) {
  if (simon.state == 0) {
    countDisplay.innerHTML = "--";
    simon.state = 1;
    window.setTimeout(function() {
      countDisplay.classList.remove("countBlink");
    }, 1500);
    countDisplay.classList.add("countBlink");
  }
});

offButton.addEventListener("click", function(event) {
  countDisplay.innerHTML = "";
  simon.reset();
  simon.state = 0;
  simon.strictState = 0;
});

let play = function(soundfile) {
  let playSound = function(event) {
    soundfile.play();
    if (
      simon.playerColorObject.length < simon.colorObject.length &&
      simon.state == 3
    ) {
      simon.playerColorObject.push(this.value);
      if (
        simon.playerColorObject[simon.playerColorObject.length - 1] !=
        simon.colorObject[simon.playerColorObject.length - 1]
      ) {
        if (simon.strictState === 1) {
          // Strict mode is working. Should display "!!" and reset the game.
          simon.wrongButtonColor();
        } else {
          setTimeout(function(event) {
            countDisplay.innerHTML = simon.count;
            simon.playerColorObject = [];
            simon.activeBoard();
          }, 1500);
          countDisplay.innerHTML = "!!";
        }
      } else if (simon.playerColorObject.length === simon.colorObject.length) {
        if (simon.playerColorObject.length === 20) {
          simon.victory();
        } else {
          simon.state = 2;
          simon.computerTurn();
        }
      }
    }
  };
  return playSound;
};

greenButton.addEventListener("click", play(audio1));
redButton.addEventListener("click", play(audio2));
yellowButton.addEventListener("click", play(audio3));
blueButton.addEventListener("click", play(audio4));

let game = function() {
  this.colorObject = [];
  this.playerColorObject = [];
  this.colorButtonNumber = null;
  this.count = 0;
  this.state = 0; // 0=off, 1=on, 2=computer active, 3=human active, 4=game over;
  this.strictState = 0; // 0 = off; 1 = strict mode is on
  this.sequenceState = 0;
};

game.prototype.victory = function() {
  setTimeout(function(event) {
    simon.reset();
    simon.state = 0;
    simon.strictState = 0;
    strictOnLight.style.backgroundColor=null;
    countDisplay.innerHTML = "--";
    victoryDisplay.innerHTML = null;
  }, 2000);
  victoryDisplay.innerHTML = "Victory!";
};

game.prototype.wrongButtonColor = function() {
  countDisplay.innerHTML = "!!";
  simon.state = 4;
  setTimeout(function() {
    countDisplay.innerHTML = "--";
    simon.reset();
    simon.state = 1;
    simon.strictState = 0;
    strictOnLight.style.backgroundColor=null;
  }, 2000);
};

game.prototype.reset = function() {
  strictOn.style.backgroundColor = null;
  simon.colorObject = [];
  simon.playerColorObject = [];
  simon.count = 0;
  simon.colorButtonNumber = null;
};

game.prototype.addColorCount = function() {
  this.count += 1;
};

game.prototype.playAudio = function(sound, addSeconds) {
  setTimeout(function() {
    sound.play();
  }, addSeconds);
};

game.prototype.addClass = function(buttonValue, item, BG, addSeconds) {
  setTimeout(function() {
    item.classList.remove("active");
    item.style.background = null;
    item.style.zindex = null;
  }, addSeconds + 300);

  setTimeout(function() {
    item.classList.add("active");
    item.style.background = BG;
    if (buttonValue == 1 || buttonValue == 3) {
      item.style.zIndex = "2";
    }
  }, addSeconds);
};

game.prototype.activeBoard = function() {
  for (let i = 0; i < this.colorObject.length; i++) {
    let startTime = i*500;
    let audioTime = startTime;  // 1. 300 2. 250
    if (this.colorObject[i] == greenButton.value) {
      this.addClass(
        greenButton.value,
        greenButton,
        "linear-gradient(120deg, limegreen, #c1fcc1)",
        startTime
      );
      this.playAudio(audio1, startTime);
    } else if (this.colorObject[i] == redButton.value) {
      this.addClass(
        redButton.value,
        redButton,
        "linear-gradient(45deg, #ffb732, red)",
        startTime
      );
      this.playAudio(audio2, startTime);
    } else if (this.colorObject[i] == yellowButton.value) {
      this.addClass(
        yellowButton.value,
        yellowButton,
        "linear-gradient(220deg, cornsilk, yellow)",
        startTime
      );
      this.playAudio(audio3, startTime);
    } else {
      this.addClass(
        blueButton.value,
        blueButton,
        "linear-gradient(150deg, #a4d2f3, blue)",
        startTime
      );
      this.playAudio(audio4, startTime);
    }
  }
};

game.prototype.makeNumber = function() {
  let num = Math.floor(Math.random() * 4) + 1;
  if (
    !(
      num < 5 &&
      num > 0 &&
      num !== this.colorObject[this.colorObject.length - 1]
    )
  ) {
    return this.makeNumber();
  }
  return num;
};

game.prototype.computerTurn = function() {
  if (this.state == 2) {
    this.colorObject.push(this.makeNumber());
    console.log("Computer: " + this.colorObject);
    this.addColorCount();
    this.activeBoard();
    countDisplay.innerHTML = this.count;
    this.playerColorObject = [];
    this.state = 3;
  }
};

let simon = new game();

startButton.addEventListener("click", function(event) {
  if (simon.state == 1) {
    simon.state = 2;
    simon.computerTurn();
  }
});

strictButton.addEventListener("click", function(event) {
  if (simon.state == 1) {
    simon.strictState = 1;
    strictOnLight.style.backgroundColor = "red";
  }
});
