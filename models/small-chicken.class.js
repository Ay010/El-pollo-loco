class SmallChicken extends MovableObject {
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  chickenIsDead = false;
  width = 50;
  height = 60;
  y = 365;
  world;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");

    this.x = 800 + Math.random() * 3000;

    this.loadImages(this.IMAGES_WALKING);

    this.speedX = 1 + Math.random() * 1;

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

  dies(index) {
    this.chickenIsDead = true;
    this.loadImage("img/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png");
    setTimeout(() => {
      this.world.level.enemies.splice(index, 1);
    }, 500);
  }
}