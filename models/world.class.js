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

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgrounds);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.throwableObjects);
    this.addObjectsToMap(this.throwableBottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    if (this.character.x > 3000 || this.showEndbossHealthBar) {
      this.addToMap(this.endbossHealthBar);
      this.showEndbossHealthBar = true;
    }
    if (this.character.x > 3500) {
      this.endbossStartWalking = true;
    }
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(object) {
    if (object.otherDirection) {
      this.flipImage(object);
    }

    object.draw(this.ctx);
    object.drawFrame(this.ctx);

    if (object.otherDirection) {
      this.flipImageBack(object);
    }
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
      if (
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
      ) {
        this.character.playedJump_sound = false;
        this.character.currentImage = 0;
        this.character.jump();

        this.character.playJumpSound();

        enemy.dies(index);
        this.playChickenDeathSound();
      } else if (
        (this.character.isColliding(enemy) && !enemy.chickenIsDead && !this.character.isAboveGround()) ||
        (this.character.isColliding(enemy) && !enemy.chickenIsDead && enemy instanceof Endboss)
      ) {
        let bossHit = 0;
        this.character.damageFromRight = false;
        this.character.damageFromLeft = false;

        if (enemy instanceof Endboss) {
          enemy.speedX = 0;
          enemy.currentImage = 0;
          bossHit = 20;
        }

        this.character.hit(20 + bossHit);
        this.healthBar.setPercentage(this.character.energy);

        if (this.character.x + this.character.width / 2 > enemy.x + enemy.width / 2) {
          this.character.damageFromLeft = true;
        } else {
          this.character.damageFromRight = true;
        }
      }
    });
  }

  characterWithCollectableBottle() {
    this.level.throwableObjects.forEach((throwableObject, index) => {
      if (this.character.isColliding(throwableObject)) {
        if (this.character.bottles < 5) {
          this.playCollectBottleSound();
        }
        this.character.collectBottle(index);
        this.bottleBar.setPercentage(this.character.bottles);
      }
    });
  }

  enemyWithThrowableObject() {
    this.throwableBottles.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          if (
            (!enemy.chickenIsDead && !bottle.exploding && enemy instanceof Chicken) ||
            (!enemy.chickenIsDead && !bottle.exploding && enemy instanceof SmallChicken)
          ) {
            bottle.explode();
            enemy.dies(index);
            this.playBottleSplashSound();
          } else if (!enemy.bossIsDead && !bottle.exploding && !enemy.stopAnimation && enemy instanceof Endboss) {
            bottle.explode();
            enemy.hit(20);
            this.playBottleSplashSound();
            enemy.isAttacking = false;
            enemy.speedX = 1.8;
            this.endbossHealthBar.setPercentage(enemy.energy);
            if (enemy.energy == 0 && !enemy.endbossIsDead) {
              enemy.dies(index);
            }
          }
        }
      });
    });
  }

  throwableObjectWithGround() {
    this.throwableBottles.forEach((bottle) => {
      if (bottle.y > 350) {
        bottle.explode();
        this.bottleSplash_sound.play();
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
      if (this.youWin()) {
        this.gameIsFinish = true;

        this.playWinSound();

        document.getElementById("end-screen-win").classList.remove("hide");
        this.character.walking_sound.pause();
        for (let i = 0; i < 1000; i++) {
          clearInterval(i);
        }
        if (document.fullscreenElement === document.getElementById("canvas")) {
          document.getElementById("canvas-container").requestFullscreen();
        }
      } else if (this.youLost()) {
        this.gameIsFinish = true;

        this.playLoseSound();

        document.getElementById("end-screen-lost").classList.remove("hide");
        this.character.walking_sound.pause();
        for (let i = 0; i < 1000; i++) {
          clearInterval(i);
        }
        if (document.fullscreenElement === document.getElementById("canvas")) {
          document.getElementById("canvas-container").requestFullscreen();
        }
      }
    }, 100);
  }

  playChickenDeathSound() {
    if (volume) {
      this.chickenDeath_sound.play();
    }
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
    if (volume) {
      this.win_sound.play();
    }
  }

  playLoseSound() {
    if (volume) {
      this.lose_sound.play();
    }
  }

  youWin() {
    return this.endbossIsDead;
  }

  youLost() {
    return this.character.stopAnimation;
  }
}
