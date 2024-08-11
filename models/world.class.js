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

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
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
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.throwableObjects);
    this.addObjectsToMap(this.throwableBottles);
    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    if (this.character.x > 400) {
      this.addToMap(this.endbossHealthBar);
    }
    this.ctx.translate(this.camera_x, 0);
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
    }, 100);
  }

  characterWithEnemy() {
    this.level.enemies.forEach((enemy, index) => {
      if (
        this.character.isColliding(enemy) &&
        this.character.speedY < 0 &&
        this.character.isAboveGround() &&
        !enemy.chickenIsDead &&
        enemy instanceof Chicken
      ) {
        this.character.jump();
        enemy.dies(index);
      } else if (
        (this.character.isColliding(enemy) && !enemy.chickenIsDead && !this.character.isAboveGround()) ||
        (this.character.isColliding(enemy) && !enemy.chickenIsDead && enemy instanceof Endboss)
      ) {
        this.character.hit(5);
        this.healthBar.setPercentage(this.character.energy);
      }
    });
  }

  characterWithCollectableBottle() {
    this.level.throwableObjects.forEach((throwableObject, index) => {
      if (this.character.isColliding(throwableObject)) {
        this.character.collectBottle(index);
        this.bottleBar.setPercentage(this.character.bottles);
      }
    });
  }

  enemyWithThrowableObject() {
    this.throwableBottles.forEach((bottle) => {
      this.level.enemies.forEach((enemy, index) => {
        if (bottle.isColliding(enemy)) {
          if (!enemy.chickenIsDead && !bottle.exploding && enemy instanceof Chicken) {
            bottle.explode();
            enemy.dies(index);
          } else if (!enemy.bossIsDead && !bottle.exploding && !enemy.stopAnimation && enemy instanceof Endboss) {
            bottle.explode();
            enemy.hit(20);
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
      }
    });
  }

  characterWithCoin() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.collectCoin(index);
        this.coinBar.setPercentage(this.character.coins);
      }
    });
  }
}
