class World {
  character = new Character();
  healthBar = new HealthBar();
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
    this.level.enemies.forEach((enemy, index) => {
      enemy.world = this;
      enemy.index = index;
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
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);

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

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit(5);
          this.healthBar.setPercentage(this.character.energy);
        }
      });
      this.level.throwableObjects.forEach((throwableObject, index) => {
        if (this.character.isColliding(throwableObject)) {
          this.character.collectBottle(index);
          this.bottleBar.setPercentage(this.character.bottles);
        }
      });

      this.throwableBottles.forEach((bottle) => {
        this.level.enemies.forEach((enemy, index) => {
          if (bottle.isColliding(enemy)) {
            if (!enemy.chickenIsDead && !bottle.exploding && enemy instanceof Chicken) {
              bottle.explode();
              enemy.dies(index);
            } else if (!enemy.bossIsDead && !bottle.exploding && enemy instanceof Endboss) {
              bottle.explode();
              enemy.hit(20);
              this.endbossHealthBar.setPercentage(enemy.energy);
              console.log(enemy.energy);
            }
          }
        });
      });
    }, 100);
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
}
