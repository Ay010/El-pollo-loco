class MovableObject extends DrawableObject {
  speedOfChangingToNextImage = 100;
  speedX = 0.15;
  speedY = 0;
  acceleration = 2.5;
  lastHit;
  energy = 100;
  damageLength = 0.5;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0 || this instanceof Bottle) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (!this.isAboveGround() && this instanceof Character) {
          this.y = 205;
        }
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 200;
  }

  isColliding(obj) {
    return this.x + this.width > obj.x && this.y + this.height > obj.y && this.x < obj.x && this.y < obj.y + obj.height;
  }

  isOn(obj) {
    return this.x + this.width > obj.x && this.y + this.height > obj.y && this.x < obj.x && this.y < obj.y + obj.height;
  }

  hit(damage) {
    this.energy -= damage;
    if (this.isDead()) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < this.damageLength;
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
