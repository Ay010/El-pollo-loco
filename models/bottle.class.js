class Bottle extends MovableObject {
  IMAGES_ROTATE = [
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_EXPLODE = [
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
  exploding = false;
  startFromBeginning = false;
  width = 90;
  height = 90;
  world;
  index;

  constructor(x, y, world, index) {
    super();
    this.loadImage("img/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.loadImages(this.IMAGES_ROTATE);
    this.loadImages(this.IMAGES_EXPLODE);
    this.x = x;
    this.y = y;
    this.world = world;
    this.index = index;

    this.speedY = 10;
    this.throw();
    this.applyGravity();
  }

  throw() {
    setInterval(() => {
      if (this.exploding == false) {
        this.x += 10;
      }
    }, 25);

    setInterval(() => {
      if (this.exploding == true) {
        if (!this.startFromBeginning) {
          this.currentImage = 0;
          this.startFromBeginning = true;
        }
        this.playExplodeAnimationOnes(this.IMAGES_EXPLODE);
      } else {
        this.playAnimation(this.IMAGES_ROTATE);
      }
    }, 100);
  }

  explode() {
    this.speedY = 0;
    this.acceleration = 0;
    this.exploding = true;
  }

  playExplodeAnimationOnes(images) {
    if (this.currentImage < images.length) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
      if (this.currentImage === images.length) {
        this.exploding = false;
        this.world.character.isThrowing = false;
        this.world.throwableBottles.splice(this.index, 1);
      }
    }
  }
}
