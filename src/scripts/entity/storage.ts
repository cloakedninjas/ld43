module LD43.Entity {
  export class Storage {
    static CELL_AVAILABLE: number = 1;
    static CELL_OCCUPIED: number = 2;

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
