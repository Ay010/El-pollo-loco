class World {
  character = new Character();
  healthBar = new HealthBar();
  coinBar = new CoinBar();
  bottleBar = new BottleBar();
  endbossHealthBar = new EndbossHealthBar();
  throwableBottles = [];
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  endbossIsDead = false;
  endbossStartWalking = false;
  showEndbossHealthBar = false;
  gameIsFinish = false;
  chickenDeath_sound = new Audio("audio/Chicken death.mp3");
  win_sound = new Audio("audio/Win.mp3");
  lose_sound = new Audio("audio/Lose.mp3");
  bottleSplash_sound = new Audio("audio/Bottle.mp3");
  hidePauseIcon = false;
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
    this.checkGameEnds();
  }

  /**
   * Sets the world for the character and enemies.
   *
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => (enemy.world = this));
  }

  /**
   * Clears the canvas and redraws all game objects.
   *
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addAllObjectsToMap();

    if (this.character.x > 3500) this.endbossStartWalking = true;

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds all game objects to the map and handles camera movement.
   *
   */
  addAllObjectsToMap() {
    this.moveCamera();
    this.addObjectsToMap(this.level.backgrounds);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.throwableObjects);
    this.addObjectsToMap(this.throwableBottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.moveCameraBack();
    this.addAllBars();
    this.moveCamera();
    this.addToMap(this.character);
    this.moveCameraBack();
  }

  /**
   * Moves the camera to the right.
   *
   */
  moveCamera() {
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Moves the camera back to the original position.
   *
   */
  moveCameraBack() {
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Adds health, bottle, coin, and optionally endboss health bars to the map.
   *
   */
  addAllBars() {
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);

    if (this.character.x > 3000 || this.showEndbossHealthBar) {
      this.addToMap(this.endbossHealthBar);
      this.showEndbossHealthBar = true;
    }
  }

  /**
   * Adds a list of objects to the map.
   *
   * @param {Array} objects - The objects to add to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => this.addToMap(object));
  }

  /**
   * Adds a single object to the map and handles its drawing.
   *
   * @param {Object} object - The object to add to the map.
   */
  addToMap(object) {
    if (object.otherDirection) this.flipImage(object);
    object.draw(this.ctx);
    object.drawFrame(this.ctx);
    if (object.otherDirection) this.flipImageBack(object);
  }

  /**
   * Flips an image horizontally for drawing.
   *
   * @param {Object} object - The object whose image to flip.
   */
  flipImage(object) {
    this.ctx.save();
    this.ctx.translate(object.width, 0);
    this.ctx.scale(-1, 1);
    object.x = object.x * -1;
  }

  /**
   * Restores the original orientation of a flipped image.
   *
   * @param {Object} object - The object whose image to restore.
   */
  flipImageBack(object) {
    object.x = object.x * -1;
    this.ctx.restore();
  }

  /**
   * Continuously checks for collisions in the game.
   *
   */
  checkCollisions() {
    setInterval(() => {
      this.characterWithEnemy();
      this.characterWithCollectableBottle();
      this.enemyWithThrowableObject();
      this.throwableObjectWithGround();
      this.characterWithCoin();
    }, 50);
  }

  /**
   * Checks collisions between the character and enemies, handling damage and death.
   *
   */
  characterWithEnemy() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.isCharacterAboveChicken(enemy)) {
        this.characterJump();
        this.chickenDies(enemy, index);
      } else if (this.characterGetsHit(enemy)) {
        if (this.itsEndboss(enemy)) this.setEndbossAttributes(enemy);
        this.character.hit(20 + (this.itsEndboss(enemy) ? 20 : 0));
        this.healthBar.setPercentage(this.character.energy);
        this.checkAttackDirection(enemy);
      }
    });
  }

  /**
   * Checks if the enemy is a normal or small chicken and if the character is above it.
   *
   * @param {Object} enemy - The enemy to check.
   * @returns {boolean} - True if the enemy is a normal or small chicken.
   */
  isCharacterAboveChicken(enemy) {
    return (
      (this.character.isColliding(enemy) &&
        this.character.speedY < 0 &&
        this.character.isAboveGround() &&
        !enemy.chickenIsDead &&
        enemy instanceof Chicken) ||
      (this.character.isColliding(enemy) &&
        this.character.speedY < 0 &&
        this.character.isAboveGround() &&
        !enemy.chickenIsDead &&
        enemy instanceof SmallChicken)
    );
  }

  /**
   * Executes the character's jump action and plays the jump sound.
   *
   */
  characterJump() {
    this.character.playedJump_sound = false;
    this.character.currentImage = 0;
    this.character.jump();
    this.character.playJumpSound();
  }

  /**
   * Handles the death of a chicken enemy.
   *
   * @param {Object} enemy - The enemy to kill.
   * @param {number} index - The index of the enemy in the array.
   */
  chickenDies(enemy, index) {
    enemy.dies(index);
    this.playChickenDeathSound();
  }

  /**
   * Checks if the character gets hit by an enemy.
   *
   * @param {Object} enemy - The enemy to check against.
   * @returns {boolean} - True if the character gets hit.
   */
  characterGetsHit(enemy) {
    return (
      (this.character.isColliding(enemy) && !enemy.chickenIsDead && !this.character.isAboveGround()) ||
      (this.character.isColliding(enemy) && !enemy.chickenIsDead && this.itsEndboss(enemy))
    );
  }

  /**
   * Determines the direction of damage taken by the character.
   *
   * @param {Object} enemy - The enemy causing the damage.
   */
  checkAttackDirection(enemy) {
    this.character.damageFromRight = false;
    this.character.damageFromLeft = false;
    if (this.character.x + this.character.width / 2 > enemy.x + enemy.width / 2) this.character.damageFromLeft = true;
    else this.character.damageFromRight = true;
  }

  /**
   * Sets specific attributes for the endboss enemy.
   *
   * @param {Object} enemy - The endboss enemy to modify.
   */
  setEndbossAttributes(enemy) {
    enemy.speedX = 0;
    enemy.currentImage = 0;
  }

  /**
   * Checks collisions between the character and collectable bottles.
   *
   */
  characterWithCollectableBottle() {
    this.level.throwableObjects.forEach((throwableObject, index) => {
      if (this.character.isColliding(throwableObject)) {
        if (this.character.bottles < 5) this.playCollectBottleSound();
        this.character.collectBottle(index);
        this.bottleBar.setPercentage(this.character.bottles);
      }
    });
  }

  /**
   * Checks collisions between throwable bottles and enemies.
   *
   */
  enemyWithThrowableObject() {
    this.throwableBottles.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          if (this.isChickenOrSmallChickenCollidingWithBottle(enemy, bottle)) this.handleChickenCollision(bottle, enemy, index);
          else if (this.itsEndboss(enemy) && !enemy.bossIsDead && !bottle.exploding && !enemy.stopAnimation)
            this.handleEndbossCollision(bottle, enemy, index);
        }
      });
    });
  }

  /**
   * Checks if the enemy is a normal or small chicken in collision with a bottle.
   *
   * @param {Object} enemy - The enemy to check.
   * @param {Object} bottle - The bottle to check.
   * @returns {boolean} - True if the conditions are met.
   */
  isChickenOrSmallChickenCollidingWithBottle(enemy, bottle) {
    return (
      (!enemy.chickenIsDead && !bottle.exploding && this.itsChicken(enemy)) ||
      (!enemy.chickenIsDead && !bottle.exploding && this.itsSmallChicken(enemy))
    );
  }

  /**
   * Handles the collision between a chicken and a bottle.
   *
   * @param {Object} bottle - The bottle involved in the collision.
   * @param {Object} enemy - The chicken enemy involved in the collision.
   * @param {number} index - The index of the enemy in the array.
   */
  handleChickenCollision(bottle, enemy, index) {
    bottle.explode();
    enemy.dies(index);
    this.playBottleSplashSound();
  }

  /**
   * Handles the collision between the endboss and a bottle.
   *
   * @param {Object} bottle - The bottle involved in the collision.
   * @param {Object} enemy - The endboss enemy involved in the collision.
   * @param {number} index - The index of the enemy in the array.
   */
  handleEndbossCollision(bottle, enemy, index) {
    bottle.explode();
    this.playBottleSplashSound();
    enemy.hit(20);
    enemy.isAttacking = false;
    enemy.speedX = 1.8;
    this.endbossHealthBar.setPercentage(enemy.energy);
    if (enemy.energy === 0 && !enemy.endbossIsDead) enemy.dies(index);
  }

  /**
   * Checks if the enemy is a chicken.
   *
   * @param {Object} enemy - The enemy to check.
   * @returns {boolean} - True if the enemy is a chicken.
   */
  itsChicken(enemy) {
    return enemy instanceof Chicken;
  }

  /**
   * Checks if the enemy is a small chicken.
   *
   * @param {Object} enemy - The enemy to check.
   * @returns {boolean} - True if the enemy is a small chicken.
   */
  itsSmallChicken(enemy) {
    return enemy instanceof SmallChicken;
  }

  /**
   * Checks if the enemy is an endboss.
   *
   * @param {Object} enemy - The enemy to check.
   * @returns {boolean} - True if the enemy is an endboss.
   */
  itsEndboss(enemy) {
    return enemy instanceof Endboss;
  }

  /**
   * Checks collisions between throwable bottles and the ground.
   *
   */
  throwableObjectWithGround() {
    this.throwableBottles.forEach((bottle) => {
      if (bottle.y > 350) {
        bottle.explode();
        if (volume) this.bottleSplash_sound.play();
      }
    });
  }

  /**
   * Checks collisions between the character and coins.
   *
   */
  characterWithCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.collectCoin(index);
        this.coinBar.setPercentage(this.character.coins);
        this.playCollectingCoinSound();
      }
    });
  }

  /**
   * Checks if the game has ended and handles the result.
   *
   */
  checkGameEnds() {
    setInterval(() => {
      if (this.gameIsFinish) return;

      const win = this.youWin();
      const lost = this.youLost();

      if (win || lost) {
        this.gameIsFinish = true;
        const sound = win ? this.playWinSound() : this.playLoseSound();
        document.getElementById(win ? "end-screen-win" : "end-screen-lost").classList.remove("hide");
        this.character.walking_sound.pause();
        for (let i = 0; i < 1000; i++) clearInterval(i);
        if (document.fullscreenElement === document.getElementById("canvas")) document.getElementById("canvas-container").requestFullscreen();
      }
    }, 100);
  }

  /**
   * Plays the sound of a chicken dying.
   *
   */
  playChickenDeathSound() {
    if (volume) this.chickenDeath_sound.play();
  }

  /**
   * Plays the sound for collecting a bottle.
   *
   */
  playCollectBottleSound() {
    if (volume) {
      let collectBottle_sound = new Audio("audio/Collect Bottle.mp3");
      collectBottle_sound.play();
    }
  }

  /**
   * Plays the sound of a bottle splash.
   *
   */
  playBottleSplashSound() {
    if (volume) {
      let bottleSplash_sound = new Audio("audio/Bottle.mp3");
      bottleSplash_sound.play();
    }
  }

  /**
   * Plays the sound for collecting a coin.
   *
   */
  playCollectingCoinSound() {
    if (volume) {
      let collectingCoin_sound = new Audio("audio/coin.mp3");
      collectingCoin_sound.play();
    }
  }

  /**
   * Plays the sound for winning the game.
   *
   */
  playWinSound() {
    if (volume) this.win_sound.play();
  }

  /**
   * Plays the sound for losing the game.
   *
   */
  playLoseSound() {
    if (volume) this.lose_sound.play();
  }

  /**
   * Checks if the player has won the game.
   *
   * @returns {boolean} - True if the endboss is dead.
   */
  youWin() {
    return this.endbossIsDead;
  }

  /**
   * Checks if the player has lost the game.
   *
   * @returns {boolean} - True if the character has stopped.
   */
  youLost() {
    return this.character.stopAnimation;
  }
}
