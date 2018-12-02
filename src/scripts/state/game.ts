module LD43.State {
  export class Game extends Phaser.State {

    static LOCATION_BAG: number = 0;
    static LOCATION_FRIDGE: number = 1;
    static LOCATION_TABLE: number = 2;
    static LOCATION_BIN: number = 3;

    static CELL_AVAILABLE: number = 1;
    static CELL_OCCUPIED: number = 2;

    bg: Phaser.Sprite;
    buttons: {
      bagR: Phaser.Button,
      fridgeL: Phaser.Button,
      fridgeR: Phaser.Button,
      fridgeD: Phaser.Button,
      tableL: Phaser.Button,
      binU: Phaser.Button,
    };
    location: number;

    storageBounds: {
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
      storageBounds: Phaser.Rectangle,
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
        fridgeR: new Phaser.Button(this.game, 1563, 725, 'arrow', this.panTo.bind(this, Game.LOCATION_TABLE)),
        fridgeD: new Phaser.Button(this.game, 1200, 1320, 'arrow', this.panTo.bind(this, Game.LOCATION_BIN)),
        tableL: new Phaser.Button(this.game, 1640, 725, 'arrow', this.panTo.bind(this, Game.LOCATION_FRIDGE)),
        binU: new Phaser.Button(this.game, 1200, 1390, 'arrow', this.panTo.bind(this, Game.LOCATION_FRIDGE)),
      };

      for (const button in this.buttons) {
        let b = this.buttons[button];

        b.anchor.set(0.5);
        this.add.existing(b);
      }

      this.buttons.fridgeL.scale.x = -1;
      this.buttons.fridgeD.angle = 90;
      this.buttons.tableL.scale.x = -1;
      this.buttons.binU.angle = 270;

      const size6 = (6 * Entity.Food.UNIT_SIZE),
        size4 = (4 * Entity.Food.UNIT_SIZE),
        shelfX = 880;

      this.storageBounds = {
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
        storageBounds: null,
        x: null,
        y: null,
      };

      this.markerGroup = new Phaser.Group(this.game);
      this.add.existing(this.markerGroup);

      this.storedFood = [];
      this.currentFood = null;
      this.location = Game.LOCATION_BAG;

      this.input.addMoveCallback(this.onPointerMove, this);
      this.input.onDown.add(this.onInputDown, this);

      window['g'] = this;
    }

    panTo(location: number) {
      let dest;

      switch (location) {
        case Game.LOCATION_BAG:
          dest = {x: 0};
          break;

        case Game.LOCATION_FRIDGE:
          dest = {x: 800, y: 0};
          break;

        case Game.LOCATION_TABLE:
          dest = {x: 1600};
          break;

        case Game.LOCATION_BIN:
          dest = {y: 1360};
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

      let storageBounds: Phaser.Rectangle,
        storage;

      switch (this.location) {
        case Game.LOCATION_FRIDGE:

          if (this.storageBounds.fridge.top.contains(px, py)) {
            storageBounds = this.storageBounds.fridge.top;
            storage = this.storage.fridge.top;
          } else if (this.storageBounds.fridge.middle.contains(px, py)) {
            storageBounds = this.storageBounds.fridge.middle;
            storage = this.storage.fridge.middle;
          } else if (this.storageBounds.fridge.bottom.contains(px, py)) {
            storageBounds = this.storageBounds.fridge.bottom;
            storage = this.storage.fridge.bottom;
          }

          if (storageBounds) {
            // get closest cell to pointer

            let x = Math.floor((px - storageBounds.x) / Entity.Food.UNIT_SIZE),
              y = Math.floor((py - storageBounds.y) / Entity.Food.UNIT_SIZE),
              cell;

            try {
              cell = storage[x][y];
            } catch (e) {
            }

            this.renderPlaceMarkerAt(storageBounds, storage, x, y);
          } else {
            this.hidePlaceMaker();
          }

          break;
        default:
          this.hidePlaceMaker();
      }
    }

    onInputDown() {
      if (this.location === Game.LOCATION_BAG && this.currentFood === null) {
        this.pickupNewFood();
        return;
      } else if (this.location !== Game.LOCATION_FRIDGE) {
        return;
      }

      if (this.currentFood !== null && this.foodPlaceable) {
        this.placeFood();
      } else {
        // nu-uh SFX
      }
    }

    renderPlaceMarkerAt(storageBounds: Phaser.Rectangle, storage: number[][], x, y) {
      if (this.prevHover.storage === storage &&
        this.prevHover.x === x &&
        this.prevHover.y === y) {
        return;
      }

      this.prevHover.storage = storage;
      this.prevHover.storageBounds = storageBounds;
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
      this.markerGroup.x = storageBounds.x + (x * Entity.Food.UNIT_SIZE);
      this.markerGroup.y = storageBounds.y + (y * Entity.Food.UNIT_SIZE);
    }

    hidePlaceMaker() {
      this.markerGroup.visible = false;
    }

    pickupNewFood() {
      // TODO - randomize food
      let f = new Entity.Food(this.game, 1);
      f.events.onInputDown.add(this.pickUpFood.bind(this, f, false));
      this.add.existing(f);

      this.hidePlaceMaker();
      this.pickUpFood(f, true);
    }

    pickUpFood(food: Entity.Food, firstTime: boolean) {
      this.currentFood = food;
      food.pickUp();
      food.placeMaker.forEach((row) => {
        row.forEach((item) => {
          if (item) {
            this.markerGroup.add(item);
          }
        });
      });

      if (!firstTime) {
        this.applyMarkerToStorage(food, food.location.storage, food.location.x, food.location.y, false);
      }
    }

    placeFood() {
      this.storedFood.push(this.currentFood);
      this.currentFood.drop({
        storage: this.prevHover.storage,
        x: this.prevHover.x,
        y: this.prevHover.y
      });

      let x = this.prevHover.storageBounds.x,
        y = this.prevHover.storageBounds.y;

      x += Entity.Food.UNIT_SIZE * this.prevHover.x;
      y += Entity.Food.UNIT_SIZE * this.prevHover.y;

      x += this.currentFood.width / 2;
      y += this.currentFood.height / 2;

      this.currentFood.position.set(x, y);

      this.applyMarkerToStorage(this.currentFood, this.prevHover.storage, this.prevHover.x, this.prevHover.y, true);

      this.currentFood = null;
      this.markerGroup.removeAll();
    }

    applyMarkerToStorage(food: Entity.Food, storage: number[][], x: number, y: number, placing: boolean) {
      food.placeMaker.forEach((row, i) => {
        row.forEach((markerCell, j) => {
          if (markerCell !== null) {
            storage[x + i][y + j] = placing ? Game.CELL_OCCUPIED : Game.CELL_AVAILABLE;
          }
        });
      });
    }
  }
}
