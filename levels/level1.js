let level1;

function initLevel() {
  level1 = new Level(
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new Endboss(),
    ],
    setClouds(),
    setBackground(),
    setCollectableBottles(),
    [new Coin(), new Coin(), new Coin(), new Coin(), new Coin()]
  );
}

function setBackground() {
  let allBackgrounds = [];
  for (let i = -1; i < 7; i++) {
    if (i % 2 === 0) {
      allBackgrounds.push(
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", i * 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", i * 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer//1.png", i * 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", i * 719)
      );
    } else {
      allBackgrounds.push(
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/air.png", i * 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", i * 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/2_second_layer//2.png", i * 719),
        new BackgroundObject("img/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", i * 719)
      );
    }
  }
  return allBackgrounds;
}

function setCollectableBottles() {
  let allCollectableBottles = [];
  for (let i = 0; i < 10; i++) {
    allCollectableBottles.push(new CollectableBottle());
  }
  return allCollectableBottles;
}

function setClouds() {
  let allClouds = [];
  for (let i = 0; i < 6; i++) {
    allClouds.push(new Cloud());
  }
  return allClouds;
}
