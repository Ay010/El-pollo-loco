class MovableObject extends DrawableObject {
  speedOfChangingToNextImage = 100;
  movementSpeed = 0.15;
  energy = 100;
  lastHit;

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
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
    return timePassed < 1;
  }

  isDead() {
    return this.energy <= 0;
  }

  moveRight() {
    this.x += this.movementSpeed;
  }

  moveLeft() {
    this.x -= this.movementSpeed;
  }

  jump() {
    this.speedY = 25;
  }
}
