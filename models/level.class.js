class Level {
  enemies;
  clouds;
  backgrounds;
  throwableObjects;
  level_end_x = 1000;

  constructor(enemies, clouds, backgrounds, throwableObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgrounds = backgrounds;
    this.throwableObjects = throwableObjects;
  }
}
