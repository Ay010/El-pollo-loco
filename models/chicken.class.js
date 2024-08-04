class Chicken extends MovableObject {
  width = 80;
  height = 90;
  y = 335;
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    this.x = 200 + Math.random() * 500;

    this.loadImages(this.IMAGES_WALKING);

    this.movementSpeed = 0.15 + Math.random() * 0.25;

    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, this.speedOfChangingToNextImage);
  }
}
