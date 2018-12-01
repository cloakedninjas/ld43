module LD43.Entity {
  export class Food extends Phaser.Sprite {
    static UNIT_SIZE: number = 109; // GOD DAMN YOU ANNA!

    game: Game;

    size: {
      w: number,
      h: number,
    };

    pickedUp: boolean = false;
    placeMaker: any;

    constructor(game, x?, y?, key?, frame?) {
      super(game, x, y, key, frame);

      this.anchor.set(0.5, 0.5);

      this.size = {
        w: this.width / Food.UNIT_SIZE,
        h: this.height / Food.UNIT_SIZE
      };

      // generate correct placeMaker
      this.placeMaker = [
        [new Phaser.Sprite(game, 0, 0, 'green_block')]
      ];
    }

    pickUp() {
      this.pickedUp = true;
      this.scale.set(0.6);
    }

    drop() {
      this.pickedUp = false;
      this.scale.set(1);
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
