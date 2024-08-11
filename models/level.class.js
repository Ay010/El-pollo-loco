class Level {
  enemies;
  clouds;
  backgrounds;
  throwableObjects;
  coins;
  level_end_x = 1000;

  constructor(enemies, clouds, backgrounds, throwableObjects, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgrounds = backgrounds;
    this.throwableObjects = throwableObjects;
    this.coins = coins;
  }
}
