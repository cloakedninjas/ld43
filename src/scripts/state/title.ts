module LD43.State {
  export class Title extends Phaser.State {
    game: LD43.Game;
    logo: any;
    bg: Phaser.Sprite;
    arrow: Phaser.Sprite;
    bagArea: Phaser.Rectangle;

    create() {
      if (this.game.world.children.length === 0) {
        this.logo = this.add.sprite(this.game.width / 2, 30, 'title');
        this.logo.anchor.x = 0.5;
      } else {
        this.logo = this.game.world.children[0];
      }

      this.bg = this.add.sprite(0, 0, 'background_bag');

      this.arrow = this.add.sprite(400, 610, 'white_arrow');
      this.arrow.anchor.set(0.5, 0.5);

      this.bg.inputEnabled = true;
      this.bg.events.onInputDown.add(this.startGame, this);

      this.bagArea = new Phaser.Rectangle(160, 561, 478, 572);

      this.game.add.tween(this.arrow).to({
        y: this.arrow.y + 35
      }, 600, Phaser.Easing.Sinusoidal.Out, true, 0, Infinity, true);

      this.logo.bringToTop();

      this.game.soundManager.playMusic('title', true, true, true);
    }

    shutdown() {
      this.arrow.destroy();
    }

    startGame(elem: any, pointer: Phaser.Pointer) {
      if (!this.bagArea.contains(pointer.x, pointer.y)) {
        return;
      }

      this.bg.inputEnabled = false;

      this.game.state.start('game', false, false, {
        logo: this.logo,
        bg: this.bg
      });
    }
  }
}
