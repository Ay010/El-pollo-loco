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
