module LD43.Entity {
  export class Storage {
    bounds: Phaser.Rectangle;
    tileMap: number[][];
    items: Entity.Food[];

    constructor(bounds: Phaser.Rectangle, tileMap: number[][]) {
      this.bounds = bounds;
      this.tileMap = tileMap;
      this.items = [];
    }
  }
}
