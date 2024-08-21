class MovableObject extends DrawableObject {
  speedOfChangingToNextImage = 100;
  speedX = 0.15;
  speedY = 0;
  acceleration = 2.5;
  lastHit = 0;
  energy = 100;
  damageLength = 0.5;
  pauseTime;
  continueTime;
  otherDirection;

  applyGravity(groundPosition = 200) {
    setInterval(() => {
      if (this.isAboveGround(groundPosition) || this.speedY > 0 || this instanceof Bottle) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (!this.isAboveGround(groundPosition) && this instanceof Character) {
          this.y = 205;
        }
      }
    }, 1000 / 25);
  }

  isColliding(obj) {
    return (
      this.x + this.offsetX / 2 + this.width - this.offsetX >= obj.x + obj.offsetX / 2 &&
      this.x + this.offsetX / 2 <= obj.x + obj.offsetX / 2 + (obj.width - obj.offsetX) &&
      this.y + this.offsetY + this.height - this.offsetY >= obj.y - obj.secondOffsetY + obj.offsetY &&
      this.y + this.offsetY <= obj.y - obj.secondOffsetY + obj.offsetY + obj.height - obj.offsetY
    );
  }

  isAboveGround(groundPosition = 200) {
    return this.y < groundPosition;
  }

  hit(damage) {
    let timePassed = new Date().getTime() - this.lastHit;
    if (timePassed > 500) {
      this.energy -= damage;
    }
    if (this.isDead()) this.energy = 0;
    else this.lastHit = new Date().getTime();
  }

  isHurt() {
    let stoppedTime;
    if (this.pauseTime && this.continueTime) {
      stoppedTime = this.continueTime - this.pauseTime;

      this.lastHit += stoppedTime;

      this.continueTime = 0;
      this.pauseTime = 0;
    }
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

  jump(jumpingHight = 30) {
    this.speedY = jumpingHight;
  }
}
