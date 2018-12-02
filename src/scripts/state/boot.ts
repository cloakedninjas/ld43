module LD43.State {
  export class Boot extends Phaser.State {
    preload() {
      this.load.image('title', 'assets/images/title.png');
    }

    create() {
      this.game.state.start('preloader');
    }
  }
}
