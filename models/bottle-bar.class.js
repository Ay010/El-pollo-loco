class BottleBar extends StatusBar {
  IMAGES = [
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  y = 60;

  percentage = 0;

  constructor() {
    super();
    this.loadImage("img/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png");
    this.loadImages(this.IMAGES);
  }

  resolveImagesIndex() {
    return this.percentage;
  }
}
