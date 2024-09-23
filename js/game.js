let canvas;
let world;
let keyboard = new Keyboard();
let resetJumpInterval;
let gameStopped = false;
let continuingGame = false;
let volume = true;
let drawFrame = false;

function init() {
  initLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

function hideStartScreen() {
  document.getElementById("start-screen").classList.add("hide");
}

function startNewGame() {
  hideWinAndLoseScreens();
  if (document.fullscreenElement === document.getElementById("canvas-container")) {
    document.getElementById("canvas").requestFullscreen();
  }
  resetGame();
}

function hideWinAndLoseScreens() {
  document.getElementById("end-screen-win").classList.add("hide");
  document.getElementById("end-screen-lost").classList.add("hide");
}

function resetGame() {
  initLevel();
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  resetJumpImageInterval(e);
  if (e.code == "ArrowUp") {
    resetJumpIntervalFunction();
    keyboard.UP = true;
  }
  if (e.code == "Space") {
    keyboard.SPACE = true;
  }
  if (e.code == "ArrowRight") {
    keyboard.RIGHT = true;
  }
  if (e.code == "ArrowLeft") {
    keyboard.LEFT = true;
  }
  if (e.code == "KeyF") {
    keyboard.KEY_F = true;
  }
});

function resetJumpImageInterval(e) {
  if (keyboard.UP === false && e.code == "ArrowUp" && !world.character.isAboveGround() && !world.character.isDead()) {
    world.character.currentImage = 0;
    resetJumpIntervalFunction();
  }
}

function resetJumpIntervalFunction() {
  resetJumpInterval = setInterval(() => {
    if (!world.character.isAboveGround() && !world.character.isDead()) {
      world.character.currentImage = 0;
    }
  }, 1000 / 60);
}

window.addEventListener("keyup", (e) => {
  if (e.code == "Space") {
    keyboard.SPACE = false;
  }
  if (e.code == "ArrowUp") {
    keyboard.UP = false;
    clearInterval(resetJumpInterval);
  }
  if (e.code == "ArrowRight") {
    keyboard.RIGHT = false;
  }
  if (e.code == "ArrowLeft") {
    keyboard.LEFT = false;
  }
  if (e.code == "KeyF") {
    keyboard.KEY_F = false;
  }
});

function canvasFullscreen() {
  document.getElementById("canvas").requestFullscreen();
}

function stopGame() {
  if (!continuingGame) {
    if (world.level) {
      world.level.enemies.forEach((enemy) => {
        enemy.pauseTime = new Date().getTime();
      });
    }
    world.character.pauseTime = new Date().getTime();

    for (let i = 0; i < 1000; i++) {
      clearInterval(i);
    }
    document.getElementById("info-icon").classList.remove("hide");
    document.getElementById("play-icon").classList.remove("hide");
    document.getElementById("pause-icon").classList.add("hide");
    document.getElementById("pause-screen").classList.remove("hide");
    document.getElementById("pause-screen").innerHTML = "Paused";

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    gameStopped = true;
  }
}

function continueGame() {
  if (!continuingGame) {
    continuingGame = true;

    closePopUp();

    document.getElementById("info-icon").classList.add("hide");

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    document.getElementById("pause-screen").innerHTML = "3";

    setTimeout(() => {
      document.getElementById("pause-screen").innerHTML = "2";
    }, 1000);
    setTimeout(() => {
      document.getElementById("pause-screen").innerHTML = "1";
    }, 2000);

    setTimeout(() => {
      document.getElementById("pause-screen").classList.add("hide");
      world.level.enemies.forEach((enemy) => {
        enemy.continueTime = new Date().getTime();
      });
      world.character.continueTime = new Date().getTime();

      world.checkCollisions();
      world.checkGameEnds();

      world.character.animate();
      world.character.applyGravity();

      world.level.coins.forEach((coin) => {
        coin.animate();
      });

      world.level.enemies.forEach((enemy, index) => {
        enemy.animate();

        if (enemy.chickenIsDead || enemy.endbossIsDead) {
          enemy.dies(index);
        }
        if (enemy instanceof Endboss) {
          enemy.applyGravity(190);
        }
      });

      world.level.clouds.forEach((cloud) => {
        cloud.animate();
      });

      world.throwableBottles.forEach((bottle) => {
        bottle.throw();
        bottle.applyGravity();
      });

      document.getElementById("play-icon").classList.add("hide");
      document.getElementById("pause-icon").classList.remove("hide");

      setTimeout(() => {
        gameStopped = false;
        continuingGame = false;
      }, 500);
    }, 3000);
  }
}

function volumeOff() {
  volume = false;

  document.getElementById("volume-on-icon").classList.add("hide");
  document.getElementById("volume-off-icon").classList.remove("hide");
}

function volumeOn() {
  volume = true;

  document.getElementById("volume-on-icon").classList.remove("hide");
  document.getElementById("volume-off-icon").classList.add("hide");
}

function openPopUp() {
  document.getElementById("howToPlayPopUp-bg").classList.remove("hide");
}

function closePopUp() {
  document.getElementById("howToPlayPopUp-bg").classList.add("hide");
}

document.addEventListener("keyup", (event) => {
  if (event.code === "Space" && world) {
    if (!world.gameIsFinish && !continuingGame) {
      if (gameStopped) continueGame();
      else stopGame();
    }
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 730px)").matches) {
    stopGame();
  }
});

function stopEvent(event) {
  event.stopPropagation();
}
