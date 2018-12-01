module LD43.State {
  export class Boot extends Phaser.State {
    preload() {
      this.load.image('phaser', 'assets/images/phaser.png');
    }

    create() {
      this.game.state.start('preloader', true);
    }
  }
}
