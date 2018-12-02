module LD43.State {
  export class Boot extends Phaser.State {
    preload() {
      this.load.image('logo', 'assets/images/phaser.png');
    }

    create() {
      this.game.state.start('preloader');
    }
  }
}
