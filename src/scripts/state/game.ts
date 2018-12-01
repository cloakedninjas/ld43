module LD43.State {
  export class Game extends Phaser.State {
    create() {
      let img = this.add.sprite(0, 0, 'bg');
      //img.anchor.x = 0.5;
      //img.anchor.y = 0.5;
    }

    panTo(location: number) {

    }
  }
}
