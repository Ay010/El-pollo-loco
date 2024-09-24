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
  IMAGES_WALKING = [
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ATTACK = [
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png",
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
  x = 4000;
  y = 190;
  width = 150;
  height = 250;
  offsetY = 45;
  offsetX = 30;
  acceleration = 2;
  speedOfChangingToNextImage = 160;
  world;
  damageLength = 1;
  bossIsDead = false;
  stopAnimation = false;
  endbossIsDead = false;
  speedX = 1.8;
  isAttacking = false;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_NORMAL_STANDING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.applyGravity(190);
  }

  animate() {
    this.animateImageChange();
    this.animateMovement();
    this.animateAttack();
  }

  animateImageChange() {
    setInterval(() => {
      if (this.isDead() && this.endbossIsDead) this.playDeadAnimationOnes(this.IMAGES_DEAD);
      else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
      else if (this.isAttacking) this.playAttackAnimationOnes(this.IMAGES_ATTACK);
      else if (this.world.endbossStartWalking) this.playAnimation(this.IMAGES_WALKING);
      else this.playAnimation(this.IMAGES_NORMAL_STANDING);
    }, this.speedOfChangingToNextImage);
  }

  animateMovement() {
    setInterval(() => {
      if (this.world.endbossStartWalking && !this.isDead() && !this.isHurt() && !this.stopMovingAfterAttack) {
        if (this.world.character.x + this.world.character.width / 2 > this.x + this.width / 2) {
          this.moveRight();
          this.otherDirection = true;
        } else {
          this.moveLeft();
          this.otherDirection = false;
        }
      }
    }, 1000 / 60);
  }

  animateAttack() {
    setInterval(() => {
      if (!this.stopMovingAfterAttack) {
        let chance = Math.floor(Math.random() * 2);
        this.currentImage = 0;
        this.isAttacking = true;

        if (chance === 0) {
          this.speedX = 3;
          this.jump(30);
        } else if (chance === 1) this.attack();
      }
    }, Math.random() * 4000 + 2000);
  }

  playAttackAnimationOnes(images) {
    if (this.currentImage < images.length && !this.stopAnimation) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
      if (this.currentImage >= images.length) {
        this.isAttacking = false;
        this.speedX = 1.8;
      }
    }
  }

  playDeadAnimationOnes(images) {
    if (this.currentImage < images.length && !this.stopAnimation) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
      if (this.currentImage >= images.length) this.stopAnimation = true;
    }
  }

  attack() {
    this.speedX = 5;
  }

  dies() {
    this.currentImage = 0;
    this.endbossIsDead = true;
    setInterval(() => {
      if (this.stopAnimation) this.world.endbossIsDead = true;
    }, 100);
  }
}
