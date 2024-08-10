class Endboss extends MovableObject {
  IMAGES_NORMAL_STANDING = [
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_HURT = [
    "img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  x = 1000;
  y = 50;
  width = 260;
  height = 400;
  speedOfChangingToNextImage = 160;
  world;
  damageLength = 1;
  index;
  bossIsDead = false;
  startDeadAnimationFromBeginning = false;
  stopAnimation = false;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_NORMAL_STANDING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        if (!this.startDeadAnimationFromBeginning) {
          this.currentImage = 0;
          this.startDeadAnimationFromBeginning = true;
        }
        this.playDeadAnimationOnes(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else {
        this.playAnimation(this.IMAGES_NORMAL_STANDING);
      }
    }, this.speedOfChangingToNextImage);
  }

  playDeadAnimationOnes(images) {
    if (this.currentImage < images.length && this.stopAnimation === false) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
      if (this.currentImage === images.length) {
        this.stopAnimation = true;
        this.acceleration = 0;
        this.world.level.enemies.splice(this.index, 1);
      }
    }
  }
}
