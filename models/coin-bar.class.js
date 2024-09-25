class CoinBar extends StatusBar {
  IMAGES = [
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  y = 100;

  percentage = 0;

  constructor() {
    super();
    this.loadImage("img/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png");
    this.loadImages(this.IMAGES);
  }

  /**
   * Returns the current percentage value to determine image state.
   */
  resolveImagesIndex() {
    return this.percentage;
  }
}
