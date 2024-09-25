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

  /**
   * Applies gravity to the object, adjusting its vertical position and speed.
   *
   * @param {number} groundPosition - The y-coordinate that defines the ground level.
   */
  applyGravity(groundPosition = 200) {
    setInterval(() => {
      if (this.isAboveGround(groundPosition) || this.speedY > 0 || this instanceof Bottle) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (!this.isAboveGround(groundPosition) && this instanceof Character) this.y = 205;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if this object is colliding with another object.
   *
   * @param {Object} obj - The object to check for collisions against.
   * @returns {boolean} - True if colliding, otherwise false.
   */
  isColliding(obj) {
    return (
      this.x + this.offsetX / 2 + this.width - this.offsetX >= obj.x + obj.offsetX / 2 &&
      this.x + this.offsetX / 2 <= obj.x + obj.offsetX / 2 + (obj.width - obj.offsetX) &&
      this.y + this.offsetY + this.height - this.offsetY >= obj.y - obj.secondOffsetY + obj.offsetY &&
      this.y + this.offsetY <= obj.y - obj.secondOffsetY + obj.offsetY + obj.height - obj.offsetY
    );
  }

  /**
   * Checks if the object is above a certain ground level.
   *
   * @param {number} groundPosition - The y-coordinate that defines the ground level.
   * @returns {boolean} - True if above ground, otherwise false.
   */
  isAboveGround(groundPosition = 200) {
    return this.y < groundPosition;
  }

  /**
   * Applies damage to the object's energy and checks if it is dead.
   *
   * @param {number} damage - The amount of damage to apply.
   */
  hit(damage) {
    let timePassed = new Date().getTime() - this.lastHit;
    if (timePassed > 500) {
      this.energy -= damage;
    }
    if (this.isDead()) this.energy = 0;
    else this.lastHit = new Date().getTime();
  }

  /**
   * Checks if the object is currently hurt based on time since last hit.
   *
   * @returns {boolean} - True if the object is hurt, otherwise false.
   */
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

  /**
   * Checks if the object is dead based on its energy level.
   *
   * @returns {boolean} - True if dead, otherwise false.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Moves the object to the right by its speed.
   */
  moveRight() {
    this.x += this.speedX;
  }

  /**
   * Moves the object to the left by its speed.
   */
  moveLeft() {
    this.x -= this.speedX;
  }

  /**
   * Initiates a jump by setting the vertical speed.
   *
   * @param {number} jumpingHight - The initial speed of the jump.
   */
  jump(jumpingHight = 30) {
    this.speedY = jumpingHight;
  }
}
