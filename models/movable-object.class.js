class MovableObject extends DrawableObject {
  speedOfChangingToNextImage = 100;
  speedX = 0.15;
  speedY = 0;
  acceleration = 2.5;

  energy = 1000;
  lastHit;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0 || this instanceof Bottle) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 200;
  }

  isColliding(obj) {
    return this.x + this.width > obj.x && this.y + this.height > obj.y && this.x < obj.x && this.y < obj.y + obj.height;
  }

  hit() {
    this.energy -= 5;
    if (this.isDead()) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 0.5;
  }

  isDead() {
    return this.energy <= 0;
  }

  moveRight() {
    this.x += this.speedX;
  }

  moveLeft() {
    this.x -= this.speedX;
  }

  jump() {
    this.speedY = 30;
  }
}
