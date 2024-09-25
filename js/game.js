let canvas;
let world;
let keyboard = new Keyboard();
let resetJumpInterval;
let gameStopped = false;
let continuingGame = false;
let volume = true;
let drawFrame = false;

/**
 * Initializes the game level and sets up the canvas.
 *
 */
function init() {
  initLevel();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Hides the start screen by adding the "hide" class.
 *
 */
function hideStartScreen() {
  document.getElementById("start-screen").classList.add("hide");
}

/**
 * Starts a new game by hiding win/lose screens and resetting the game.
 *
 */
function startNewGame() {
  hideWinAndLoseScreens();
  if (document.fullscreenElement === document.getElementById("canvas-container")) {
    document.getElementById("canvas").requestFullscreen();
  }
  resetGame();
}

/**
 * Hides the win and lose screens by adding the "hide" class.
 *
 */
function hideWinAndLoseScreens() {
  document.getElementById("end-screen-win").classList.add("hide");
  document.getElementById("end-screen-lost").classList.add("hide");
}

/**
 * Resets the game by initializing the level and creating new keyboard and world instances.
 *
 */
function resetGame() {
  initLevel();
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);
}

/**
 * Handles keydown events to update keyboard state for various keys.
 *
 */
window.addEventListener("keydown", (e) => {
  resetJumpImageInterval(e);
  if (e.code == "ArrowUp") {
    resetJumpIntervalFunction();
    keyboard.UP = true;
  }
  if (e.code == "Space") keyboard.SPACE = true;

  if (e.code == "ArrowRight") keyboard.RIGHT = true;

  if (e.code == "ArrowLeft") keyboard.LEFT = true;

  if (e.code == "KeyF") keyboard.KEY_F = true;
});

/**
 * Resets the jump image interval if the character is not above ground and not dead.
 *
 */
function resetJumpImageInterval(e) {
  if (keyboard.UP === false && e.code == "ArrowUp" && !world.character.isAboveGround() && !world.character.isDead())
    resetJumpInterval = setInterval(() => resetJumpIntervalFunction(), 1000 / 60);
}

/**
 * Handles keyup events to update keyboard state for various keys and clear intervals.
 *
 */
window.addEventListener("keyup", (e) => {
  if (e.code == "ArrowUp") {
    keyboard.UP = false;
    clearInterval(resetJumpInterval);
  }

  if (e.code == "Space") keyboard.SPACE = false;

  if (e.code == "ArrowRight") keyboard.RIGHT = false;

  if (e.code == "ArrowLeft") keyboard.LEFT = false;

  if (e.code == "KeyF") keyboard.KEY_F = false;
});

/**
 * Resets the jump image if the character is not above ground and not dead.
 *
 */
function resetJumpIntervalFunction() {
  if (!world.character.isAboveGround() && !world.character.isDead()) world.character.currentImage = 0;
}

/**
 * Sets the LEFT key state to true for moving left.
 *
 */
function moveLeft() {
  keyboard.LEFT = true;
}

/**
 * Sets the LEFT key state to false to stop moving left.
 *
 */
function stopMoveLeft() {
  keyboard.LEFT = false;
}

/**
 * Sets the RIGHT key state to true for moving right.
 *
 */
function moveRight() {
  keyboard.RIGHT = true;
}

/**
 * Sets the RIGHT key state to false to stop moving right.
 *
 */
function stopMoveRight() {
  keyboard.RIGHT = false;
}

/**
 * Initiates a jump by setting the UP key state and starting the jump image interval.
 *
 */
function jump() {
  resetJumpInterval = setInterval(() => resetJumpIntervalFunction(), 1000 / 60);

  keyboard.UP = true;
}

/**
 * Sets the UP key state to false to stop jumping and clears the jump interval.
 *
 */
function stopJump() {
  keyboard.UP = false;
  clearInterval(resetJumpInterval);
}

/**
 * Sets the KEY_F state to true to initiate throwing a bottle.
 *
 */
function throwBottle() {
  keyboard.KEY_F = true;
}

/**
 * Sets the KEY_F state to false to stop throwing a bottle.
 *
 */
function stopThrowBottle() {
  keyboard.KEY_F = false;
}

/**
 * Requests to display the canvas element in fullscreen mode.
 *
 */
function canvasFullscreen() {
  document.getElementById("canvas").requestFullscreen();
}

/**
 * Stops the game by saving pause time, clearing intervals, and displaying the pause screen.
 *
 */
function stopGame() {
  if (!continuingGame) {
    savePauseTime();
    clearAllIntervals();
    showPlayControls();
    document.getElementById("pause-screen").innerHTML = "Paused";
    closeFullScreen();
    gameStopped = true;
  }
}

/**
 * Saves the current pause time for each enemy and the character.
 *
 */
function savePauseTime() {
  if (world.level) {
    world.level.enemies.forEach((enemy) => (enemy.pauseTime = new Date().getTime()));
  }
  world.character.pauseTime = new Date().getTime();
}

/**
 * Clears all intervals up to a maximum of 1000.
 *
 */
function clearAllIntervals() {
  for (let i = 0; i < 1000; i++) clearInterval(i);
}

/**
 * Displays the play controls and updates the visibility of icons.
 *
 */
function showPlayControls() {
  document.getElementById("info-icon").classList.remove("hide");
  document.getElementById("play-icon").classList.remove("hide");
  document.getElementById("pause-icon").classList.add("hide");
  document.getElementById("pause-screen").classList.remove("hide");
}

/**
 * Exits fullscreen mode if currently in fullscreen.
 *
 */
function closeFullScreen() {
  if (document.fullscreenElement) document.exitFullscreen();
}

/**
 * Resumes the game by closing pop-ups, updating UI elements, and managing intervals.
 *
 */
function continueGame() {
  if (!continuingGame) {
    continuingGame = true;
    closePopUp();
    closeFullScreen();
    document.getElementById("info-icon").classList.add("hide");
    countDown();

    setTimeout(() => {
      document.getElementById("pause-screen").classList.add("hide");
      saveContinueGameTime();
      continueIntervals();
      changePauseIcon();

      setTimeout(() => {
        gameStopped = false;
        continuingGame = false;
      }, 500);
    }, 3000);
  }
}

/**
 * Displays a countdown on the pause screen from 3 to 1.
 *
 */
function countDown() {
  document.getElementById("pause-screen").innerHTML = "3";

  setTimeout(() => {
    document.getElementById("pause-screen").innerHTML = "2";
  }, 1000);
  setTimeout(() => {
    document.getElementById("pause-screen").innerHTML = "1";
  }, 2000);
}

/**
 * Saves the current continue time for each enemy and the character.
 *
 */
function saveContinueGameTime() {
  world.level.enemies.forEach((enemy) => (enemy.continueTime = new Date().getTime()));
  world.character.continueTime = new Date().getTime();
}

/**
 * Continues all game intervals related to the world, character, coins, clouds, bottles, and enemies.
 *
 */
function continueIntervals() {
  continueWorldIntervals();
  continueCharacterIntervals();
  continueCoinIntervals();
  continueCloudIntervals();
  continueBottleIntervals();
  continueEnemyIntervals();
}

/**
 * Checks for collisions and game end conditions in the world.
 *
 */
function continueWorldIntervals() {
  world.checkCollisions();
  world.checkGameEnds();
}

/**
 * Animates the character and applies gravity effects.
 *
 */
function continueCharacterIntervals() {
  world.character.animate();
  world.character.applyGravity();
}

/**
 * Animates all coins in the current level.
 *
 */
function continueCoinIntervals() {
  world.level.coins.forEach((coin) => coin.animate());
}

/**
 * Animates all clouds in the current level.
 *
 */
function continueCloudIntervals() {
  world.level.clouds.forEach((cloud) => cloud.animate());
}

/**
 * Applies throwing and gravity effects to all throwable bottles.
 *
 */
function continueBottleIntervals() {
  world.throwableBottles.forEach((bottle) => {
    bottle.throw();
    bottle.applyGravity();
  });
}

/**
 * Animates all enemies, applies gravity, and handles death conditions.
 *
 */
function continueEnemyIntervals() {
  world.level.enemies.forEach((enemy, index) => {
    enemy.animate();
    if (enemy.chickenIsDead || enemy.endbossIsDead) enemy.dies(index);

    if (enemy instanceof Endboss) enemy.applyGravity(190);
  });
}

/**
 * Changes the pause icon by hiding the play icon and showing the pause icon.
 *
 */
function changePauseIcon() {
  document.getElementById("play-icon").classList.add("hide");
  document.getElementById("pause-icon").classList.remove("hide");
}

/**
 * Mutes the volume by hiding the volume-on icon and showing the volume-off icon.
 *
 */
function volumeOff() {
  volume = false;

  document.getElementById("volume-on-icon").classList.add("hide");
  document.getElementById("volume-off-icon").classList.remove("hide");
}

/**
 * Unmutes the volume by showing the volume-on icon and hiding the volume-off icon.
 *
 */
function volumeOn() {
  volume = true;

  document.getElementById("volume-on-icon").classList.remove("hide");
  document.getElementById("volume-off-icon").classList.add("hide");
}

/**
 * Opens the pop-up for "How to Play" by removing the hide class.
 *
 */
function openPopUp() {
  document.getElementById("howToPlayPopUp-bg").classList.remove("hide");
}

/**
 * Closes the pop-up for "How to Play" by adding the hide class.
 *
 */
function closePopUp() {
  document.getElementById("howToPlayPopUp-bg").classList.add("hide");
}

/**
 * Listens for keyup events to toggle game continuation or stopping when the spacebar is pressed.
 *
 */
document.addEventListener("keyup", (event) => {
  if (event.code === "Space" && world) {
    if (!world.gameIsFinish && !continuingGame) {
      if (gameStopped) continueGame();
      else stopGame();
    }
  }
});

/**
 * Listens for window resize events and stops the game if the window width is 730px or less.
 *
 */
window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 730px)").matches) stopGame();
});

/**
 * Stops the propagation of the specified event.
 *
 * @param {Event} event - The event to stop propagation for.
 */
function stopEvent(event) {
  event.stopPropagation();
}
