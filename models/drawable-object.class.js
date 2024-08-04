class DrawableObject {
  x = 100;
  y = 205;
  width = 110;
  height = 220;
  img;
  imageCache = {};
  currentImage = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = "5";
      ctx.stroke();
    }
  }
}
