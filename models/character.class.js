class Character extends MovableObject {
  x = 100;
  y = 205;
  width = 110;
  height = 220;

  constructor() {
    super().loadImage("img/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png");
  }

  jump() {}
}
