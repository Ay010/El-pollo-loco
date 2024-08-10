class Character extends MovableObject {
  IMAGES_STANDING = [
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png",
    "img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png",
    "img/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMP = [
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png",
  ];
  IMAGES_THROW = ["img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png"];
  IMAGES_HURT = [
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png",
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png",
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_DEAD = [
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png",
    "img/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png",
  ];
  x = 100;
  y = 205;
  width = 110;
  height = 220;
  world;
  speedOfChangingToNextImage = 120;
  speedX = 6;
  otherDirection;
  bottles = 0;
  isThrowing = false;
  stopAnimation = false;
  startDeadAnimationFromBeginning = false;
  playedJump_sound = false;
  walking_sound = new Audio("/audio/Walking.mp3");
  jump_sound = new Audio("/audio/Jump.mp3");

  constructor() {
    super();
    this.loadAllImages();
    this.animate();
    this.applyGravity();
  }

  loadAllImages() {
    this.loadImage("img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_STANDING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_THROW);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
  }

  animate() {
    setInterval(() => {
      this.move();
      this.throwBottle();
      this.getDamage();

      if (!this.isAboveGround()) {
        this.playedJump_sound = false;
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      this.playAllAnimations();
    }, this.speedOfChangingToNextImage);
  }

  move() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && !this.isHurt() && !this.isDead()) {
      this.moveRight();
      this.otherDirection = false;
    }
    if (this.world.keyboard.LEFT && this.x > -50 && !this.isHurt() && !this.isDead()) {
      this.moveLeft();
      this.otherDirection = true;
    }
    if (
      (this.world.keyboard.UP && !this.isAboveGround() && !this.isDead()) ||
      (this.world.keyboard.SPACE && !this.isAboveGround() && !this.isDead())
    ) {
      this.jump();
    }
    if (this.isDead()) {
      setInterval(() => {
        this.y += 2;
      }, 500);
    }
  }

  throwBottle() {
    if (this.world.keyboard.KEY_F) {
      if (this.bottles > 0 && !this.isThrowing) {
        this.isThrowing = true;
        this.bottles--;
        let bottle = new Bottle(this.x + 50, this.y + 80, this.world, this.world.throwableBottles.length);
        this.world.throwableBottles.push(bottle);
        this.world.bottleBar.setPercentage(this.bottles);
      }
    }
  }

  getDamage() {
    if (this.isHurt() && this.x > 0) {
      this.x -= 4;
    }
  }

  playAllAnimations() {
    this.walking_sound.pause();

    if (this.isDead()) {
      if (!this.startDeadAnimationFromBeginning) {
        this.currentImage = 0;
        this.startDeadAnimationFromBeginning = true;
      }
      this.playDeadAnimationOnes(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMP);
      if (!this.playedJump_sound) {
        this.jump_sound.play();
        this.playedJump_sound = true;
      }
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      this.walking_sound.play();
    } else if (this.world.keyboard.KEY_F && this.isThrowing) {
      this.playAnimation(this.IMAGES_THROW);
    } else {
      this.playAnimation(this.IMAGES_STANDING);
    }
  }

  playDeadAnimationOnes(images) {
    if (this.currentImage < images.length && this.stopAnimation === false) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
      if (this.currentImage === images.length) {
        this.stopAnimation = true;
        this.acceleration = 0;
      }
    }
  }

  collectBottle(index) {
    if (this.bottles < 5) {
      this.world.level.throwableObjects.splice(index, 1);
      this.bottles++;
    }
  }
}
