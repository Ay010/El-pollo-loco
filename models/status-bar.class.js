class StatusBar extends DrawableObject {
  x = 20;
  width = 190;
  height = 55;

  percentage;

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImagesIndex()];
    this.img = this.imageCache[path];
  }
}
