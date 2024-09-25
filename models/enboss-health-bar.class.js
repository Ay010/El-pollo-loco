class EndbossHealthBar extends StatusBar {
  IMAGES = [
    "img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  y = 10;
  x = 500;
  percentage = 100;

  constructor() {
    super();
    this.loadImage("img/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange100.png");
    this.loadImages(this.IMAGES);
  }

  /**
   * Resolves the index of the image based on the current percentage value.
   */
  resolveImagesIndex() {
    if (this.percentage === 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else if (this.percentage >= 0) return 0;
  }
}
