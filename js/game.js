let canvas;
let world;
let keyboard = new Keyboard();
let resetJumpInterval;
let gameStopped = false;

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
  document.getElementById("play-icon").classList.remove("hide");
  document.getElementById("pause-icon").classList.add("hide");

  gameStopped = true;
}

function continueGame() {
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
      console.log(enemy);
      enemy.dies(index);
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
  gameStopped = false;
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (gameStopped) {
      continueGame();
    } else {
      stopGame();
    }
  }
});
