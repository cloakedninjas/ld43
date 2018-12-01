module LD43.State {
  export class Game extends Phaser.State {

    static LOCATION_BAG: number = 0;
    static LOCATION_FRIDGE: number = 1;
    static LOCATION_RIGHT: number = 2;
    static LOCATION_BOTTOM: number = 3;

    bg: Phaser.Sprite;
    buttons: {
      bagR: Phaser.Button,
      fridgeL: Phaser.Button,
      fridgeR: Phaser.Button
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
    moveRecalcRequired: boolean = true;

    create() {
      this.bg = this.add.sprite(0, 0, 'bg');
      this.game.camera.bounds.width = this.bg.width;
      this.game.camera.bounds.height = this.bg.height;

      this.buttons = {
        bagR: new Phaser.Button(this.game, 763, 725, 'arrow', this.panTo.bind(this, Game.LOCATION_FRIDGE)),
        fridgeL: new Phaser.Button(this.game, 836, 725, 'arrow', this.panTo.bind(this, Game.LOCATION_BAG)),
        fridgeR: new Phaser.Button(this.game, 1563, 725, 'arrow', this.panTo.bind(this, Game.LOCATION_BAG))
      };

      for (const button in this.buttons) {
        let b = this.buttons[button];

        b.anchor.set(0.5);
        this.add.existing(b);
      }

      this.buttons.fridgeL.scale.x = -1;

      const size6 = (6 * Entity.Food.UNIT_SIZE),
        size4 = (4 * Entity.Food.UNIT_SIZE),
        shelfX = 880;

      this.storageLocation = {
        fridge: {
          top: new Phaser.Rectangle(shelfX, 163, size6, (2 * Entity.Food.UNIT_SIZE)),
          middle: new Phaser.Rectangle(shelfX, 406, size6, size4),
          bottom: new Phaser.Rectangle(shelfX, 858, size6, size4)
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

      let storageLocation,
        storage;

      switch (this.location) {
        case Game.LOCATION_FRIDGE:

          if (this.storageLocation.fridge.top.contains(px, py)) {
            storageLocation = this.storageLocation.fridge.top;
            storage = this.storage.fridge.top;
          } else if (this.storageLocation.fridge.middle.contains(px, py)) {
            storageLocation = this.storageLocation.fridge.middle;
            storage = this.storage.fridge.middle;
          } else {
            storageLocation = this.storageLocation.fridge.bottom;
            storage = this.storage.fridge.bottom;
          }

          // get closest cell to pointer

          let x = Math.floor((px - storageLocation.x) / Entity.Food.UNIT_SIZE),
            y = Math.floor((py - storageLocation.y) / Entity.Food.UNIT_SIZE),
            cell = storage[x][y];

          if (cell === 1) {
            // only attempt marker placement if arrow above valid cell
            this.renderPlaceMarkerAt(storageLocation, x, y);
          }
          break;
      }
    }

    renderPlaceMarkerAt(storageLocation, x, y) {
      // todo, optimise

      this.markerGroup.x = storageLocation.x + (x * Entity.Food.UNIT_SIZE);
      this.markerGroup.y = storageLocation.y + (y * Entity.Food.UNIT_SIZE);
    }
  }
}
