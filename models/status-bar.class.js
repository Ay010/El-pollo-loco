class StatusBar extends DrawableObject {
  x = 20;
  width = 190;
  height = 55;

  percentage;

  /**
   * Sets the percentage value and updates the image based on it.
   *
   * @param {number} percentage - The new percentage to set.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImagesIndex()];
    this.img = this.imageCache[path];
  }
}
