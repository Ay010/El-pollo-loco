class MovableObject {
  x;
  y;
  img;
  width;
  height;
  imageCache = {};
  currentImage = 0;
  speedOfChangingToNextImage = 100;
  movementSpeed = 0.15;

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

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.movementSpeed;
    }, 1000 / 60);
  }
}
