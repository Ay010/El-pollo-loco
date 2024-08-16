class CollectableBottle extends DrawableObject {
  y = 340;
  width = 90;
  height = 90;
  offsetX = 30;
  offsetY = 10;

  constructor() {
    super();
    this.loadImage(this.randomImage());
    this.x += Math.random() * 3500 + 200;
  }

  randomImage() {
    let number = Math.floor(Math.random() * 2);
    if (number === 0) {
      return "img/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png";
    } else if (number === 1) {
      return "img/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png";
    }
  }
}
