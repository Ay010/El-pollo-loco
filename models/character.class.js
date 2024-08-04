class Character extends MovableObject {
  IMAGES_STANDING = [
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
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png",
    "img/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png",
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
  IMAGES_HURT = [
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png",
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png",
    "img/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png",
  ];
  x = 100;
  y = 205;
  width = 110;
  height = 220;
  world;
  speedOfChangingToNextImage = 80;
  movementSpeed = 6;
  otherDirection;
  speedY = 0;
  acceleration = 2.5;
  isJumping = false;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_STANDING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);

    this.animate();
    this.applyGravity();
  }

  animate() {
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if ((this.world.keyboard.UP && !this.isAboveGround()) || (this.world.keyboard.SPACE && !this.isAboveGround())) {
        this.jump();
      }
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMP);
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_STANDING);
      }
    }, this.speedOfChangingToNextImage);
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 200;
  }
}
