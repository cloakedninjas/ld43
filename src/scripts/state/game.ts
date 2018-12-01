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
        top: number[][],
        middle: number[][],
        bottom: number[][],
      }
    };

    foodPlaceable: boolean;
    currentFood: Entity.Food;
    markerGroup: Phaser.Group;
    prevHover: {
      storageLocation: Phaser.Rectangle,
      storage: number[][],
      x: number,
      y: number,
    };

    storedFood: Entity.Food[];

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

      this.prevHover = {
        storage: null,
        storageLocation: null,
        x: null,
        y: null,
      };

      this.markerGroup = new Phaser.Group(this.game);
      this.add.existing(this.markerGroup);

      this.storedFood = [];

      // TODO - change
      let f = new Entity.Food(this.game, 10, 10, 'food_block');
      this.add.existing(f);

      f.pickUp();
      this.currentFood = f;

      f.placeMaker.forEach((row) => {
        row.forEach((item) => {
          if (item) {
            this.markerGroup.add(item);
          }
        });
      });

      this.input.addMoveCallback(this.onPointerMove, this);
      this.input.onDown.add(this.onPointerDown, this);

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

    onPointerMove(pointer: Phaser.Pointer) {
      if (this.currentFood === null) {
        return;
      }

      const px = pointer.x + this.camera.x,
        py = pointer.y + this.camera.y;

      let storageLocation: Phaser.Rectangle,
        storage;

      switch (this.location) {
        case Game.LOCATION_FRIDGE:

          if (this.storageLocation.fridge.top.contains(px, py)) {
            storageLocation = this.storageLocation.fridge.top;
            storage = this.storage.fridge.top;
          } else if (this.storageLocation.fridge.middle.contains(px, py)) {
            storageLocation = this.storageLocation.fridge.middle;
            storage = this.storage.fridge.middle;
          } else if (this.storageLocation.fridge.bottom.contains(px, py)) {
            storageLocation = this.storageLocation.fridge.bottom;
            storage = this.storage.fridge.bottom;
          }

          if (storageLocation) {
            // get closest cell to pointer

            let x = Math.floor((px - storageLocation.x) / Entity.Food.UNIT_SIZE),
              y = Math.floor((py - storageLocation.y) / Entity.Food.UNIT_SIZE),
              cell;

            try {
              cell = storage[x][y];
            } catch (e) {
            }

            this.renderPlaceMarkerAt(storageLocation, storage, x, y);
          } else {
            this.hidePlaceMaker();
          }

          break;
        default:
          this.hidePlaceMaker();
      }
    }

    onPointerDown() {
      if (this.location !== Game.LOCATION_FRIDGE) {
        return;
      }

      if (this.currentFood !== null && this.foodPlaceable) {
        this.placeFood();
      } else {
        // nu-uh SFX
      }
    }

    renderPlaceMarkerAt(storageLocation: Phaser.Rectangle, storage: number[][], x, y) {
      if (this.prevHover.storage === storage &&
        this.prevHover.x === x &&
        this.prevHover.y === y) {
        return;
      }

      this.prevHover.storage = storage;
      this.prevHover.storageLocation = storageLocation;
      this.prevHover.x = x;
      this.prevHover.y = y;

      this.foodPlaceable = true;

      // match up place marker cells with storage cells

      this.currentFood.placeMaker.forEach((row, i) => {
        row.forEach((markerCell, j) => {
          if (markerCell !== null) {
            let storageCell;

            try {
              storageCell = storage[x + i][y + j];
            } catch (e) {
            }

            if (storageCell === 1) {
              markerCell.loadTexture('green_block');
            } else {
              markerCell.loadTexture('red_block');
              this.foodPlaceable = false;
            }
          }
        });
      });

      this.markerGroup.visible = true;
      this.markerGroup.x = storageLocation.x + (x * Entity.Food.UNIT_SIZE);
      this.markerGroup.y = storageLocation.y + (y * Entity.Food.UNIT_SIZE);
    }

    hidePlaceMaker() {
      this.markerGroup.visible = false;
    }

    placeFood() {
      this.storedFood.push(this.currentFood);
      this.currentFood.drop();

      let x = this.prevHover.storageLocation.x,
        y = this.prevHover.storageLocation.y;

      x += Entity.Food.UNIT_SIZE * this.prevHover.x;
      y += Entity.Food.UNIT_SIZE * this.prevHover.y;

      x += this.currentFood.width / 2;
      y += this.currentFood.height / 2;

      this.currentFood.position.set(x, y);
      this.currentFood = null;
    }
  }
}
