class Coin extends MovableObject {
  width = 130;
  height = 130;
  speedOfChangingToNextImage = 150;
  y = 0;
  x = 0;

  IMAGES = ["img/img_pollo_locco/img/8_coin/coin_1.png", "img/img_pollo_locco/img/8_coin/coin_2.png"];

  constructor() {
    super();
    this.loadImage("img/img_pollo_locco/img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES);

    this.animate();

    this.x += Math.random() * 700 + 400;
    this.y += Math.random() * 120 + 30;
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, this.speedOfChangingToNextImage);
  }
}
