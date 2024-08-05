class HealthBar extends StatusBar {
  IMAGES = [
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  y = 0;

  percentage = 100;

  constructor() {
    super();
    this.loadImage("img/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png");
    this.loadImages(this.IMAGES);
  }

  resolveImagesIndex() {
    if (this.percentage === 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else if (this.percentage >= 0) {
      return 0;
    }
  }
}
