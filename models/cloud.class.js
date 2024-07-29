class Cloud extends MovableObject {
  width = 500;
  height = 300;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 500;
    this.y = 5 + Math.random() * 15;

    this.animate();
  }

  animate() {
    this.moveLeft();
  }
}
