module LD43.State {
  export class Game extends Phaser.State {

    static LOCATION_BAG: number = 0;
    static LOCATION_FRIDGE: number = 1;
    static LOCATION_RIGHT: number = 2;
    static LOCATION_BOTTOM: number = 3;

    bg: Phaser.Sprite;
    buttons: {
      bagR: Phaser.Button,
      fridgeL: Phaser.Button
    };
    location: number;

    storageLocation: {
      fridge: {
        top: Phaser.Rectangle,
        middle: Phaser.Rectangle,
        bottom: Phaser.Rectangle,
      }
    };

    storage: {
      fridge: {
        top: any,
        middle: any,
        bottom: any,
      }
    };

    currentFood: Entity.Food;
    markerGroup: Phaser.Group;

    create() {
      this.bg = this.add.sprite(0, 0, 'bg');
      this.game.camera.bounds.width = this.bg.width;
      this.game.camera.bounds.height = this.bg.height;

      this.buttons = {
        bagR: new Phaser.Button(this.game, 740, 500, 'arrow', this.panTo.bind(this, Game.LOCATION_FRIDGE)),
        fridgeL: new Phaser.Button(this.game, 810, 500, 'arrow', this.panTo.bind(this, Game.LOCATION_BAG))
      };

      for (const button in this.buttons) {
        this.add.existing(this.buttons[button]);
      }

      this.storageLocation = {
        fridge: {
          top: new Phaser.Rectangle(881, 163, 638, 208),
          middle: new Phaser.Rectangle(881, 163, 638, 208),
          bottom: new Phaser.Rectangle(881, 163, 638, 208)
        }
      };

      this.storage = {
        fridge: {
          top: [
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1]
          ],
          middle: [
            [1, 1, 0, 0],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 0, 0]
          ],
          bottom: [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 0],
            [1, 1, 1, 0],
            [1, 1, 1, 1],
            [1, 1, 1, 1]
          ]
        }
      };

      this.markerGroup = new Phaser.Group(this.game);
      this.add.existing(this.markerGroup);

      let f = new Entity.Food(this.game, 10, 10, 'food_block');
      this.add.existing(f);

      f.pickUp();
      this.currentFood = f;

      f.placeMaker.forEach((row) => {
        row.forEach((item) => {
          this.markerGroup.add(item);
        });
      });

      this.input.addMoveCallback(this.onMove, this);

      window['g'] = this;
    }

    panTo(location: number) {
      let dest;

      switch (location) {
        case Game.LOCATION_BAG:
          dest = {x: 0};
          break;

        case Game.LOCATION_FRIDGE:
          dest = {x: 800};
          break;
      }

      let tween = this.game.add.tween(this.game.camera).to(dest, 500, Phaser.Easing.Sinusoidal.Out, true);

      tween.onComplete.add(() => {
        this.location = location;
      }, this);
    }

    onMove(pointer: Phaser.Pointer) {
      const px = pointer.x + this.camera.x,
            py = pointer.y + this.camera.y;

      switch (this.location) {
        case Game.LOCATION_FRIDGE:

          if (this.storageLocation.fridge.top.contains(px, py)) {
            // get map

            // get closest cell to pointer

            let x = Math.floor((px - this.storageLocation.fridge.top.x) / Entity.Food.UNIT_SIZE),
                y = Math.floor((py - this.storageLocation.fridge.top.y) / Entity.Food.UNIT_SIZE);

            if (this.storage.fridge.top[x][y] === 1) {
              this.renderPlaceMarkerAt(this.storageLocation.fridge.top, x, y);
            }

            // top shelf
          } else {
            // bottom shelf
          }
          break;
      }
    }

    renderPlaceMarkerAt(storageLocation, x, y) {
      this.markerGroup.x = storageLocation.x + (x * Entity.Food.UNIT_SIZE);
      this.markerGroup.y = storageLocation.y + (y * Entity.Food.UNIT_SIZE);
    }
  }
}
