module LD43.Entity {
  export class Food extends Phaser.Sprite {
    static UNIT_SIZE: number = 106;

    static SPOIL_GOOD: number = 1;
    static SPOIL_OK: number = 2;
    static SPOIL_BAD: number = 3;

    game: Game;

    pickedUp: boolean = false;
    placeMaker: Phaser.Sprite[][];
    location: {
      storage: Entity.Storage,
      x: number,
      y: number
    };
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

      this.placeMaker = [];

      this.data.shape.forEach((row, i) => {
        this.placeMaker.push([]);

        row.forEach((cell, j) => {
          let val;

          if (cell === 1) {
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
    }

    drop(location, inFridge: boolean) {
      this.pickedUp = false;
      this.scale.set(1);
      this.inputEnabled = true;

      this.location.storage = location.storage;
      this.location.x = location.x;
      this.location.y = location.y;

      if (inFridge) {
        console.log('pausing');
        this.spoilTimer.pause();
      } else if (this.spoilTimer.paused) {
        console.log('resuming');
        this.spoilTimer.resume();
      }
    }

    spoil(state: number) {
      this.spoilState = state;

      const config = this.game.cache.getJSON('config');

      if (this.spoilState === Food.SPOIL_OK) {
        this.spoilTimer.add(Phaser.Timer.SECOND * config.spoil_time_2, this.spoil, this, Food.SPOIL_BAD);
      }

      console.log(this.data.name, this.spoilState);
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
