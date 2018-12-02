module LD43.Entity {
  export class Food extends Phaser.Sprite {
    static UNIT_SIZE: number = 106;
    static POINT_PER_CELL: number = 2;

    game: Game;

    pickedUp: boolean = false;
    placeMaker: Phaser.Sprite[][];
    location: {
      storage: number[][],
      x: number,
      y: number
    };
    cellCount: number;

    constructor(game: Phaser.Game, id: number) {
      super(game, 0, 0);
      this.anchor.set(0.5, 0.5);

      const foodData = game.cache.getJSON('food');
      const item = foodData[id];

      this.loadTexture(item.asset);
      this.cellCount = 0;
      this.placeMaker = [];

      item.shape.forEach((row, i) => {
        this.placeMaker.push([]);

        row.forEach((cell, j) => {
          let val;

          if (cell === 1) {
            val = new Phaser.Sprite(game, i * Food.UNIT_SIZE, j * Food.UNIT_SIZE, 'green_block');
            this.cellCount++;
          } else {
            val = null;
          }

          this.placeMaker[i].push(val);
        });
      });

      this.location = {
        storage: null,
        x: null,
        y: null
      };
    }

    pickUp() {
      this.pickedUp = true;
      this.scale.set(0.6);
      this.inputEnabled = false;
    }

    drop(location) {
      this.pickedUp = false;
      this.scale.set(1);
      this.inputEnabled = true;

      this.location.storage = location.storage;
      this.location.x = location.x;
      this.location.y = location.y;
    }

    update() {
      if (this.pickedUp) {
        let game = this.game;

        this.x = game.input.activePointer.x + game.camera.x;
        this.y = game.input.activePointer.y + game.camera.y;
      }
    }

  }
}
