class Chicken extends MovableObject {
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  chickenIsDead = false;
  width = 80;
  height = 90;
  y = 335;
  world;
  index;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    this.x = 500 + Math.random() * 700;

    this.loadImages(this.IMAGES_WALKING);

    this.speedX = 0.15 + Math.random() * 0.25;

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.chickenIsDead === false) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.chickenIsDead === false) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, this.speedOfChangingToNextImage);
  }

  dies() {
    this.chickenIsDead = true;
    this.loadImage("img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png");
    setTimeout(() => {
      this.world.level.enemies.splice(this.index, 1);
    }, 500);
  }
}
