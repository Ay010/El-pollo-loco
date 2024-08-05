class StatusBar extends DrawableObject {
  x = 20;
  width = 200;
  height = 60;

  percentage;

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImagesIndex()];
    this.img = this.imageCache[path];
  }
}
