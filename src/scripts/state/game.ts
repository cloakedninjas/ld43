module LD43.State {
  export class Game extends Phaser.State {

    static LOCATION_BAG: number = 0;
    static LOCATION_FRIDGE: number = 1;
    static LOCATION_TABLE: number = 2;
    static LOCATION_BIN: number = 3;

    static CELL_AVAILABLE: number = 1;
    static CELL_OCCUPIED: number = 2;

    game: LD43.Game;
    titleElems: any;

    bg: Phaser.Sprite;
    bagArea: Phaser.Rectangle;

    buttons: {
      bagR: Phaser.Button,
      fridgeL: Phaser.Button,
      fridgeR: Phaser.Button,
      fridgeD: Phaser.Button,
      tableL: Phaser.Button,
      binU: Phaser.Button,
    };
    location: number;
    panTween: Phaser.Tween;

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

    init(opts) {
      this.titleElems = opts;
    }

    create() {
      const game = this.game;

      this.bg = this.add.sprite(0, 0, 'background_full_2');
      this.bg.alpha = 0;
      game.camera.bounds.width = this.bg.width;
      game.camera.bounds.height = this.bg.height;

      this.bagArea = new Phaser.Rectangle(160, 561, 478, 572);

      let buttonSprite = 'arrows';

      this.buttons = {
        bagR: new Phaser.Button(game, 763, 725, buttonSprite, this.panTo.bind(this, Game.LOCATION_FRIDGE), null, null, null, 1),
        fridgeL: new Phaser.Button(game, 836, 725, buttonSprite, this.panTo.bind(this, Game.LOCATION_BAG), null, null, null, 1),
        fridgeR: new Phaser.Button(game, 1563, 725, buttonSprite, this.panTo.bind(this, Game.LOCATION_TABLE), null, null, null, 1),
        fridgeD: new Phaser.Button(game, 1200, 1320, buttonSprite, this.panTo.bind(this, Game.LOCATION_BIN), null, null, null, 1),
        tableL: new Phaser.Button(game, 1640, 725, buttonSprite, this.panTo.bind(this, Game.LOCATION_FRIDGE), null, null, null, 1),
        binU: new Phaser.Button(game, 1200, 1390, buttonSprite, this.panTo.bind(this, Game.LOCATION_FRIDGE), null, null, null, 1)
      };

      for (const button in this.buttons) {
        let b: Phaser.Button = this.buttons[button];
        b.events.onInputOver.add(() => {
          if (this.currentFood !== null && (this.panTween == null || !this.panTween.isRunning)) {
            b.onInputUp.dispatch();
          }

        }, this);

        b.anchor.set(0.5);
        this.add.existing(b);
      }

      this.buttons.bagR.alpha = 0;
      this.buttons.bagR.angle = 90;
      this.buttons.fridgeL.angle = 270;
      this.buttons.fridgeR.angle = 90;
      this.buttons.fridgeD.angle = 180;
      this.buttons.tableL.angle = 270;

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

      this.markerGroup = new Phaser.Group(game);
      this.add.existing(this.markerGroup);

      this.storedFood = [];
      this.currentFood = null;
      this.location = Game.LOCATION_BAG;

      this.input.addMoveCallback(this.onPointerMove, this);
      this.input.onDown.add(this.onInputDown, this);

      //game.soundManager.playMusic('snackrifice');

      window['g'] = this;

      // init complete begin transition

      const delay = 0,
        duration = 1000;

      this.titleElems.logo.bringToTop();

      this.game.add.tween(this.titleElems.logo).to({
        y: (-this.titleElems.logo.height)
      }, duration, Phaser.Easing.Sinusoidal.Out, true, delay);

      let tween = this.game.add.tween(this.titleElems.bg).to({
        alpha: 0
      }, duration, Phaser.Easing.Sinusoidal.Out, true, delay);

      tween.onComplete.add(this.cleanupIntro, this);

      //

      this.game.add.tween(this.bg).to({
        alpha: 1
      }, duration, Phaser.Easing.Sinusoidal.Out, true, delay);

      this.game.add.tween(this.buttons.bagR).to({
        alpha: 1
      }, duration, Phaser.Easing.Sinusoidal.Out, true, delay);
    }

    cleanupIntro() {
      this.titleElems.bg.destroy();
      this.titleElems.logo.destroy();
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

      this.panTween = this.game.add.tween(this.game.camera).to(dest, 500, Phaser.Easing.Sinusoidal.Out, true);

      this.panTween.onComplete.add(() => {
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

    onInputDown(pointer: Phaser.Pointer) {
      if (
        this.location === Game.LOCATION_BAG &&
        this.currentFood === null &&
        this.bagArea.contains(pointer.x, pointer.y)
      ) {
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
              markerCell.loadTexture('box_green');
            } else {
              markerCell.loadTexture('box_red');
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
      let id = Math.floor(Phaser.Math.random(0, 4));

      let f = new Entity.Food(this.game, id);
      f.events.onInputDown.add(this.pickUpFood.bind(this, f, false));
      this.add.existing(f);

      this.hidePlaceMaker();
      this.pickUpFood(f, true);
    }

    pickUpFood(food: Entity.Food, firstTime: boolean) {
      if (this.currentFood !== null) {
        return;
      }

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
      const placedInFridge = this.prevHover.storage === this.storage.fridge.top ||
        this.prevHover.storage === this.storage.fridge.middle ||
        this.prevHover.storage === this.storage.fridge.bottom

      this.storedFood.push(this.currentFood);

      this.currentFood.drop({
        storage: this.prevHover.storage,
        x: this.prevHover.x,
        y: this.prevHover.y
      }, placedInFridge);

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

    endGame() {
      this.game.state.start('scores');
    }
  }
}
