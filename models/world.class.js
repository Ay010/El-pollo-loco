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

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
    this.checkGameEnds();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addAllObjectsToMap();

    if (this.character.x > 3500) this.endbossStartWalking = true;

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

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

  moveCamera() {
    this.ctx.translate(this.camera_x, 0);
  }

  moveCameraBack() {
    this.ctx.translate(-this.camera_x, 0);
  }

  addAllBars() {
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);

    if (this.character.x > 3000 || this.showEndbossHealthBar) {
      this.addToMap(this.endbossHealthBar);
      this.showEndbossHealthBar = true;
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(object) {
    if (object.otherDirection) this.flipImage(object);
    object.draw(this.ctx);
    object.drawFrame(this.ctx);
    if (object.otherDirection) this.flipImageBack(object);
  }

  flipImage(object) {
    this.ctx.save();
    this.ctx.translate(object.width, 0);
    this.ctx.scale(-1, 1);
    object.x = object.x * -1;
  }

  flipImageBack(object) {
    object.x = object.x * -1;
    this.ctx.restore();
  }

  checkCollisions() {
    setInterval(() => {
      this.characterWithEnemy();
      this.characterWithCollectableBottle();
      this.enemyWithThrowableObject();
      this.throwableObjectWithGround();
      this.characterWithCoin();
    }, 50);
  }

  characterWithEnemy() {
    this.level.enemies.forEach((enemy, index) => {
      if (this.itsNormalOrSmallChickenAndMore(enemy)) {
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

  itsNormalOrSmallChickenAndMore(enemy) {
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

  characterJump() {
    this.character.playedJump_sound = false;
    this.character.currentImage = 0;
    this.character.jump();
    this.character.playJumpSound();
  }

  chickenDies(enemy, index) {
    enemy.dies(index);
    this.playChickenDeathSound();
  }

  characterGetsHit(enemy) {
    return (
      (this.character.isColliding(enemy) && !enemy.chickenIsDead && !this.character.isAboveGround()) ||
      (this.character.isColliding(enemy) && !enemy.chickenIsDead && this.itsEndboss(enemy))
    );
  }

  checkAttackDirection(enemy) {
    this.character.damageFromRight = false;
    this.character.damageFromLeft = false;
    if (this.character.x + this.character.width / 2 > enemy.x + enemy.width / 2) this.character.damageFromLeft = true;
    else this.character.damageFromRight = true;
  }

  setEndbossAttributes(enemy) {
    enemy.speedX = 0;
    enemy.currentImage = 0;
  }

  characterWithCollectableBottle() {
    this.level.throwableObjects.forEach((throwableObject, index) => {
      if (this.character.isColliding(throwableObject)) {
        if (this.character.bottles < 5) this.playCollectBottleSound();
        this.character.collectBottle(index);
        this.bottleBar.setPercentage(this.character.bottles);
      }
    });
  }

  enemyWithThrowableObject() {
    this.throwableBottles.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          if (this.itsNormalOrSmallChickenAndMoreTwo(enemy, bottle)) {
            this.handleChickenCollision(bottle, enemy, index);
          } else if (this.itsEndboss(enemy) && !enemy.bossIsDead && !bottle.exploding && !enemy.stopAnimation) {
            this.handleEndbossCollision(bottle, enemy, index);
          }
        }
      });
    });
  }

  itsNormalOrSmallChickenAndMoreTwo(enemy, bottle) {
    return (
      (!enemy.chickenIsDead && !bottle.exploding && this.itsChicken(enemy)) ||
      (!enemy.chickenIsDead && !bottle.exploding && this.itsSmallChicken(enemy))
    );
  }

  handleChickenCollision(bottle, enemy, index) {
    bottle.explode();
    enemy.dies(index);
    this.playBottleSplashSound();
  }

  handleEndbossCollision(bottle, enemy, index) {
    bottle.explode();
    this.playBottleSplashSound();
    enemy.hit(20);
    enemy.isAttacking = false;
    enemy.speedX = 1.8;
    this.endbossHealthBar.setPercentage(enemy.energy);
    if (enemy.energy === 0 && !enemy.endbossIsDead) enemy.dies(index);
  }

  itsChicken(enemy) {
    return enemy instanceof Chicken;
  }

  itsSmallChicken(enemy) {
    return enemy instanceof SmallChicken;
  }

  itsEndboss(enemy) {
    return enemy instanceof Endboss;
  }

  throwableObjectWithGround() {
    this.throwableBottles.forEach((bottle) => {
      if (bottle.y > 350) {
        bottle.explode();
        if (volume) this.bottleSplash_sound.play();
      }
    });
  }

  characterWithCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.collectCoin(index);
        this.coinBar.setPercentage(this.character.coins);
        this.playCollectingCoinSound();
      }
    });
  }

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

  playChickenDeathSound() {
    if (volume) this.chickenDeath_sound.play();
  }

  playCollectBottleSound() {
    if (volume) {
      let collectBottle_sound = new Audio("audio/Collect Bottle.mp3");
      collectBottle_sound.play();
    }
  }

  playBottleSplashSound() {
    if (volume) {
      let bottleSplash_sound = new Audio("audio/Bottle.mp3");
      bottleSplash_sound.play();
    }
  }

  playCollectingCoinSound() {
    if (volume) {
      let collectingCoin_sound = new Audio("audio/coin.mp3");
      collectingCoin_sound.play();
    }
  }

  playWinSound() {
    if (volume) this.win_sound.play();
  }

  playLoseSound() {
    if (volume) this.lose_sound.play();
  }

  youWin() {
    return this.endbossIsDead;
  }

  youLost() {
    return this.character.stopAnimation;
  }
}
