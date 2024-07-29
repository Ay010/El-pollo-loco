class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];
  backgrounds = [
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", 0),
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer//1.png", 0),
    new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0),
  ];
  canvas;
  ctx;

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addObjectsToMap(this.backgrounds);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addToMap(this.character);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(object) {
    this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
  }
}
