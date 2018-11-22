let onePlayerButton = document.getElementById("onePlayer");
let twoPlayerButton = document.getElementById("twoPlayers");
let visibleNucleolus = document.getElementById("visibleNucleolus");
let hiddenNucleolus1 = document.getElementById("hiddenNucleolus1");
let hiddenNucleolus2 = document.getElementById("hiddenNucleolus2");
let xButton = document.getElementById("x-button");
let oButton = document.getElementById("o-button");
let gridButtons = document.getElementsByClassName("box");
let messageBox = document.getElementById("messageBox");
let resetButton = document.getElementById("resetButton");
let currentScore = document.getElementById("currentScore");
let heading = document.getElementById("heading");

let activateNucleolus1 = function() {
  visibleNucleolus.style.display = "none";
  hiddenNucleolus1.style.display = "flex";
};

let activateNucleolus2 = function() {
  hiddenNucleolus1.style.display = "none";
  heading.style.display = "none";
  hiddenNucleolus2.style.display = "flex";
  resetButton.style.display = "flex";
};

let game = function() {
  // defines a new game class
  this.numberOfPlayers = null;
  this.playerType = null;
  this.firstPlayer=null;
  this.X = 0;
  this.O = 0;
}; // end of definition of game class

game.prototype.setPlayerType = function(pType) {
  this.playerType = pType;
};

game.prototype.setNumberOfPlayers = function(numPlayers) {
  this.numberOfPlayers = numPlayers;
};

game.prototype.getNumberOfPlayers = function() {
  // returns number of players
  return this.numberOfPlayers;
};

game.prototype.getPlayerType = function() {
  return this.playerType;
};

game.prototype.changePlayer = function() {
  if (this.getPlayerType() === "X") {
    this.setPlayerType("O");
  } else {
    this.setPlayerType("X");
  }
};

game.prototype.addVictory = function(winner) {
  this[winner] += 1;
};

game.prototype.getScore = function() {
  return "Player X: " + this.X + "<br> " + "Player O"+ ": " + this.O;
};

let board = function() {
  // states: null=inactive, 1=1 player game in session; 2=2 player game in session; 3=game over;
  this.state = null;
  this.blockState = true;
  this.object = {};
};

board.prototype.horizontalMeasurements = function() {
  if (this.object[1] === this.object[2] && this.object[2] === this.object[3]) {
    return this.object[2];
  } else if (
    this.object[4] === this.object[5] &&
    this.object[5] === this.object[6]
  ) {
    return this.object[5];
  } else if (
    this.object[7] === this.object[8] &&
    this.object[8] === this.object[9]
  ) {
    return this.object[8];
  }
  return false;
};

board.prototype.columnMeasurements = function() {
  //measure vertical columns
  if (this.object[1] === this.object[4] && this.object[4] === this.object[7]) {
    return this.object[4];
  } else if (
    this.object[2] === this.object[5] &&
    this.object[5] === this.object[8]
  ) {
    return this.object[5];
  } else if (
    this.object[3] === this.object[6] &&
    this.object[6] === this.object[9]
  ) {
    return this.object[6];
  } else {
    return false;
  }
};

board.prototype.diagonalMeasurements = function() {
  //measures whether diagonal boxes have same letters
  if (this.object[1] === this.object[5] && this.object[5] === this.object[9]) {
    return this.object[5];
  } else if (
    this.object[3] === this.object[5] &&
    this.object[5] === this.object[7]
  ) {
    return this.object[5];
  } else {
    return false;
  }
};

board.prototype.controller = function() {
  if (this.horizontalMeasurements(this.object)) {
    return this.horizontalMeasurements(this.object);
  } else if (this.columnMeasurements(this.object)) {
    return this.columnMeasurements(this.object);
  } else if (this.diagonalMeasurements(this.object)) {
    return this.diagonalMeasurements(this.object);
  } else {
    return false;
  }
};

board.prototype.newGame = function() {
  this.state = 0;
  messageBox.style.display = "none";
  currentScore.style.display = "none";
  this.object = {};
  newClick.setPlayerType(newClick.firstPlayer);
  gridArrayButtons.forEach(function(button) {
    button.innerHTML = "";
  });
};

board.prototype.emptySpace = function(space) {
  if (!this.object.hasOwnProperty(space)) {
    return true;
  }
  return false;
};

board.prototype.spaceFiller = function(space) {
  this.object[space] = newClick.getPlayerType();
  document.querySelector(
    "button.box[value='" + space + "']"
  ).innerHTML = newClick.getPlayerType();
};

board.prototype.computerBrain = function() {
  this.blockState = true;
  if (this.blockState) {
    this.horizontalSpaceFiller("O");
  }

  if (this.blockState) {
    this.horizontalSpaceFiller("X");
  }

  if (this.blockState) {
    this.verticalSpaceFiller("O");
  }
  if (this.blockState) {
    this.verticalSpaceFiller("X");
  }

  if (this.blockState) {
    this.diagonalSpaceFiller("O");
  }

  if (this.blockState) {
    this.diagonalSpaceFiller("X");
  }

  if (this.blockState && this.emptySpace(5)) {
    this.spaceFiller(5);
    this.blockState = false;
  }

  if (this.blockState) {
    for (let index3 = 1; index3 < 9; index3++) {
      if (index3 % 2 !== 0 && this.emptySpace(index3)) {
        this.spaceFiller(index3);
        break;
      } else if (this.emptySpace(index3)) {
        this.spaceFiller(index3);
        break;
      }
    }
  }
 newClick.changePlayer();
  this.blockState = true;
};

board.prototype.endGame = function() {
  if (this.controller()) {
    newClick.addVictory(this.controller());
    messageBox.style.display = "flex";
    messageBox.innerHTML = this.controller() + " wins! <br>";
    currentScore.innerHTML = newClick.getScore();
    this.state = 3;
    setTimeout(this.newGame.bind(this), 4000);
  } else if (Object.keys(this.object).length === 9) {
    messageBox.style.display = "flex";
    messageBox.innerHTML = "It was a draw!";
    this.state = 3;
    setTimeout(this.newGame.bind(this), 4000);
  }
};

board.prototype.fillCondition = function(letter, space1, space2, space3) {
  if (
    this.object[space1] === letter &&
    this.object[space2] === letter &&
    this.emptySpace(space3)
  ) {
    return true;
  }
  return false;
};

board.prototype.diagonalSpaceFiller = function(letter) {
  if (this.fillCondition(letter, 1, 5, 9)) {
    this.spaceFiller(9);
    this.blockState = false;
  } else if (this.fillCondition(letter, 3, 5, 7)) {
    this.spaceFiller(7);
    this.blockState = false;
  } else if (this.fillCondition(letter, 5, 9, 1)) {
    this.spaceFiller(1);
    this.blockState = false;
  } else if (this.fillCondition(letter, 5, 7, 3)) {
    this.spaceFiller(3);
    this.blockState = false;
  } else if (
    this.fillCondition(letter, 1, 9, 5) ||
    this.fillCondition(letter, 3, 7, 5)
  ) {
    this.spaceFiller(5);
    this.blockState = false;
  }
};

board.prototype.horizontalSpaceFiller = function(letter) {
  for (let ind = 1; ind < 10; ind += 3) {
    if (this.fillCondition(letter, ind, ind + 1, ind + 2)) {
      this.spaceFiller(ind + 2);
      this.blockState = false;
    } else if (this.fillCondition(letter, ind + 1, ind + 2, ind)) {
      this.spaceFiller(ind);
      this.blockState = false;
    } else if (this.fillCondition(letter, ind, ind + 2, ind + 1)) {
      this.spaceFiller(ind + 1);
      this.blockState = false;
    }
  }
};

board.prototype.verticalSpaceFiller = function(letter) {
  for (let index2 = 0; index2 < 3; index2++) {
    if (this.fillCondition(letter, index2 + 1, index2 + 4, index2 + 7)) {
      this.spaceFiller(index2 + 7);
      this.blockState = false;
    } else if (this.fillCondition(letter, index2 + 4, index2 + 7, index2 + 1)) {
      this.spaceFiller(index2 + 1);
      this.blockState = false;
    } else if (this.fillCondition(letter, index2 + 1, index2 + 7, index2 + 4)) {
      this.spaceFiller(index2 + 4);
      this.blockState = false;
    }
  }
};

let boardController = new board();

resetButton.addEventListener("click", function(event) {
  boardController.newGame();
  hiddenNucleolus2.style.display = "none";
  resetButton.style.display = "none";
  visibleNucleolus.style.display = "flex";
  newClick.O = 0;
  newClick.X = 0;
});

let newClick = new game();

onePlayerButton.addEventListener("click", function(event) {
  activateNucleolus1();
  activateNucleolus2();
  newClick.setPlayerType("X");
  newClick.firstPlayer=newClick.getPlayerType();
  newClick.setNumberOfPlayers(this.value);
});

twoPlayerButton.addEventListener("click", function(event) {
  activateNucleolus1();
  newClick.setNumberOfPlayers(this.value);
});

let letterButtons = function(event){
  activateNucleolus2();
  newClick.setPlayerType(this.value);
  newClick.firstPlayer=this.value;
};

xButton.addEventListener("click", letterButtons);
oButton.addEventListener("click", letterButtons);

let gridArrayButtons = [];
for (let index = 0; index < gridButtons.length; index++) {
  gridArrayButtons.push(gridButtons[index]);
}
gridArrayButtons.forEach(function(button) {
  //forEach loop
  button.addEventListener("click", function(event) {
    if (boardController.state !== 3) {
      boardController.state = newClick.getNumberOfPlayers();
  currentScore.style.display = "flex";
  currentScore.innerHTML = newClick.getScore();
  if (boardController.emptySpace(button.value)) {
    boardController.object[button.value] = newClick.getPlayerType();
     button.innerHTML = newClick.getPlayerType();
    newClick.changePlayer();
    boardController.endGame();
        if (boardController.state==1){   // This was moved from the button to here because X would change to O if clicked on the same box.
        boardController.computerBrain();
        boardController.endGame();
        }
  } else {
    messageBox.style.display = "flex";
    messageBox.innerHTML = "Choose another box!";
  }
    } // 1 player else
  }); // event listener
}); // forEach loop
