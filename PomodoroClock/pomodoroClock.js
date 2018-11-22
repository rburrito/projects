let decreaseBreak = document.getElementById("decreaseBreak");
let increaseBreak = document.getElementById("increaseBreak");
let decreaseSession = document.getElementById("decreaseSession");
let increaseSession = document.getElementById("increaseSession");
let countdownButton = document.getElementById("start");
let breakDisplay = document.getElementById("breaklength");
let sessionDisplay = document.getElementById("sessionlength");
let minutesCountdown = document.getElementById("countdown");
let secondsCountdown = document.getElementById("secondsCountdown");
let buttonText = document.getElementById("session");
let startButton = document.getElementById("start");

let breakLength = 5;
let sessionLength = 25;
let seconds = 0;
let countdownState = 0; // 0-clock is not running; 1-clock is counting down in session mode; 2 is counting down in break mode
let newCountdown = 0;
let ID;
let minutes;

decreaseBreak.addEventListener("click", function(event) {
  if (breakLength >= 2 && countdownState === 0) {
    breakLength -= 1;
    breakDisplay.innerHTML = breakLength;
    if (newCountdown === 2) {
      minutes = breakLength;
      seconds = 0;
      minutesCountdown.innerHTML = minutes + ":";
      secondsCountdown.innerHTML = "00";
    }
  }
});

increaseBreak.addEventListener("click", function(event) {
  if (countdownState === 0) {
    breakLength += 1;
    breakDisplay.innerHTML = breakLength;
    if (newCountdown === 2) {
      minutes = breakLength;
      seconds = 0;
      minutesCountdown.innerHTML = minutes + ":";
      secondsCountdown.innerHTML = "00";
    }
  }
});

decreaseSession.addEventListener("click", function(event) {
  if (sessionLength >= 2 && countdownState === 0) {
    sessionLength -= 1;
    sessionDisplay.innerHTML = sessionLength;
    if (newCountdown === 1) {
      minutes = sessionLength;
      seconds = 0;
      minutesCountdown.innerHTML = minutes + ":";
      secondsCountdown.innerHTML = "00";
    }
  }
});

increaseSession.addEventListener("click", function(event) {
  if (countdownState === 0) {
    sessionLength += 1;
    sessionDisplay.innerHTML = sessionLength;
    if (newCountdown === 1) {
      minutes = sessionLength;
      seconds = 0;
      minutesCountdown.innerHTML = minutes + ":";
      secondsCountdown.innerHTML = "00";
    }
  }
});

function updateCountdown() {
  if (countdownState === 1) {
    // IF
    startButton.style.backgroundColor = "#7a9e9f";
    buttonText.innerHTML = "SESSION";
  } else if (countdownState === 2) {
    // IF

    // ELSE
    startButton.style.backgroundColor = "black";
    buttonText.innerHTML = "BREAK";
  } //ELSE

  if (minutes > 0) {
    // if1
    if (seconds === 0) {
      minutes -= 1;
      seconds = 60;
    }
    seconds -= 1;
    minutesCountdown.innerHTML = minutes;
    if (seconds >= 10) {
      secondsCountdown.innerHTML = ":" + seconds;
    } else {
      secondsCountdown.innerHTML = ":0" + seconds;
    }
  } else if (seconds > 0) {
    // end of if1, beginning of else if 1
    seconds -= 1;
    if (seconds >= 10) {
      minutesCountdown.innerHTML = "0:";
      secondsCountdown.innerHTML = seconds;
    } else {
      // end of else if 1
      // else
      minutesCountdown.innerHTML = "";
      secondsCountdown.innerHTML = seconds + "s";
    } // else
  } else if (minutes === 0 && seconds === 0) {
    if (countdownState === 1) {
      minutes = breakLength;
      countdownState = 2;
    } else if (countdownState === 2) {
      minutes = sessionLength;
      countdownState = 1;
    }
  }
} // UPDATE COUNTDOWN

startButton.addEventListener("click", function(event) {
  if (countdownState === 0) {
    if (newCountdown === 0) {
      minutes = sessionLength;
      countdownState = 1;
    } else {
      countdownState = newCountdown;
    }
    ID = setInterval(updateCountdown, 1000);
  } else {
    newCountdown = countdownState;
    countdownState = 0;
    buttonText.innerHTML = "TIMER PAUSED";
    clearInterval(ID);
  }
});
