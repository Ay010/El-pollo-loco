class Chicken extends MovableObject {
  width = 80;
  height = 90;
  y = 335;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    this.x = 200 + Math.random() * 500;
  }
}
