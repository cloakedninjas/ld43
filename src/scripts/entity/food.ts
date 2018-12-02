module LD43.Entity {
  export class Food extends Phaser.Sprite {
    static UNIT_SIZE: number = 106;

    game: Game;

    pickedUp: boolean = false;
    placeMaker: Phaser.Sprite[][];
    location: {
      storage: number[][],
      x: number,
      y: number
    };

    constructor(game, x?, y?, key?, frame?) {
      super(game, x, y, key, frame);

      this.anchor.set(0.5, 0.5);

      // TODO: generate correct placeMaker
      this.placeMaker = [
        [
          new Phaser.Sprite(game, 0, 0, 'green_block'),
          new Phaser.Sprite(game, 0, Food.UNIT_SIZE, 'green_block')
        ],
        [
          null,
          new Phaser.Sprite(game, Food.UNIT_SIZE, Food.UNIT_SIZE, 'green_block')
        ]
      ];

      this.location = {
        storage: null,
        x: null,
        y: null
      }
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
