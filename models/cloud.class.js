class Cloud extends MovableObject {
  width = 500;
  height = 300;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 5000;
    this.y = 5 + Math.random() * 20;
    this.speedX = Math.random() * 0.2;
    this.animate();
  }

  /**
   * Continuously moves the object to the left at a fixed frame rate.
   */
  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
  }
}
