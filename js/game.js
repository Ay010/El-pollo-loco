let canvas;
let world;
let keyboard = new Keyboard();
let resetJumpInterval;

function init() {
  initLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  console.log(world);
}

function hideStartScreen() {
  document.getElementById("start-screen").classList.add("hide");
}

function startNewGame() {
  document.getElementById("end-screen-win").classList.add("hide");
  document.getElementById("end-screen-lost").classList.add("hide");

  if (document.fullscreenElement === document.getElementById("canvas-container")) {
    document.getElementById("canvas").requestFullscreen();
  }

  initLevel();
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  if (e.code == "Space") {
    keyboard.SPACE = true;
  }

  if (keyboard.UP === false && e.code == "ArrowUp" && !world.character.isAboveGround() && !world.character.isDead()) {
    world.character.currentImage = 0;

    resetJumpInterval = setInterval(() => {
      if (!world.character.isAboveGround() && !world.character.isDead()) {
        world.character.currentImage = 0;
      }
    }, 1000 / 60);
  }

  if (e.code == "ArrowUp") {
    keyboard.UP = true;
  }

  if (e.code == "ArrowRight") {
    keyboard.RIGHT = true;
  }

  if (e.code == "ArrowLeft") {
    keyboard.LEFT = true;
  }

  if (e.code == "ArrowDown") {
    keyboard.DOWN = true;
  }

  if (e.code == "KeyF") {
    keyboard.KEY_F = true;
  }
});

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

  if (e.code == "ArrowDown") {
    keyboard.DOWN = false;
  }

  if (e.code == "KeyF") {
    keyboard.KEY_F = false;
  }
});

function canvasFullscreen() {
  document.getElementById("canvas").requestFullscreen();
}

function stopGame() {
  for (let i = 0; i < 1000; i++) {
    clearInterval(i);
  }
}

function continueGame() {
  // Code ....
}
