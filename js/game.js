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
 * Listens for window resize events and stops the game if the window width is 550px or less.
 *
 */
window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 550px)").matches) stopGame();
});

/**
 * Stops the propagation of the specified event.
 *
 * @param {Event} event - The event to stop propagation for.
 */
function stopEvent(event) {
  event.stopPropagation();
}
