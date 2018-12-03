module LD43.Entity {
  export class Food extends Phaser.Sprite {
    static UNIT_SIZE: number = 106;

    static SPOIL_GOOD: number = 1;
    static SPOIL_OK: number = 2;
    static SPOIL_BAD: number = 3;

    static SHAPE_EMPTY: number = 0;
    static SHAPE_FILL: number = 1;

    game: Game;

    pickedUp: boolean = false;
    placeMaker: Phaser.Sprite[][];
    location: StorageLocation;
    cellCount: number;
    spoilState: number;
    spoilTimer: Phaser.Timer;
    data: {
      name: string,
      asset: string,
      shape: number[][]
    };

    constructor(game: Phaser.Game, id: number) {
      super(game, 0, 0);
      this.anchor.set(0.5, 0.5);

      const foodData = game.cache.getJSON('food');
      const config = game.cache.getJSON('config');

      this.data = foodData[id];

      this.loadTexture('food-' + this.data.asset + '-1');
      this.cellCount = 0;
      this.spoilState = Food.SPOIL_GOOD;
      this.spoilTimer = game.time.create();
      this.spoilTimer.add(Phaser.Timer.SECOND * config.spoil_time_1, this.spoil, this, Food.SPOIL_OK);
      this.spoilTimer.add(Phaser.Timer.SECOND * config.spoil_time_2, this.spoil, this, Food.SPOIL_BAD);
      this.spoilTimer.start();

      this.placeMaker = [];

      this.data.shape.forEach((row, i) => {
        this.placeMaker.push([]);

        row.forEach((cell, j) => {
          let val;

          if (cell === Food.SHAPE_FILL) {
            val = new Phaser.Sprite(game, i * Food.UNIT_SIZE, j * Food.UNIT_SIZE, 'box_green');
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

      if (this.location.storage) {
        const index = this.location.storage.items.indexOf(this);

        if (index !== -1) {
          this.location.storage.items.splice(index, 1);
        }
      }
    }

    drop(location: StorageLocation, inFridge: boolean) {
      this.pickedUp = false;
      this.scale.set(1);
      this.inputEnabled = true;

      this.location = location;
      this.location.storage.items.push(this);

      if (inFridge) {
        this.spoilTimer.pause();
      } else {
        this.spoilTimer.resume();
      }
    }

    spoil(state: number) {
      this.spoilState = state;

      let key = this.key.toString().replace(/-\d/, '-' + this.spoilState);
      this.loadTexture(key);

      if (this.spoilState === Food.SPOIL_BAD) {
        this.spoilTimer.destroy();
      }
    }

    calcScore() {
      const config = this.game.cache.getJSON('config');
      let score = config.base_score_per_unit * this.cellCount;

      switch (this.spoilState) {
        case Food.SPOIL_GOOD:
          score *= config.spoil_good_multiplier;
          break;

        case Food.SPOIL_OK:
          score *= config.spoil_ok_multiplier;
          break;

        case Food.SPOIL_BAD:
          score *= config.spoil_bad_multiplier;
          break;
      }

      return score;
    }

    getFootprint(): number[] {
      const footprint = [];

      this.data.shape.forEach((row) => {
        let lastCell = row[row.length - 1];
        footprint.push(lastCell);
      });

      return footprint;
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
