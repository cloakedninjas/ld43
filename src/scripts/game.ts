/// <reference path="../refs.d.ts" />

module LD43 {
  export class Game extends Phaser.Game {

    constructor() {
      super({
        width: 800,
        height: 1360,
        renderer: Phaser.AUTO,
        scaleMode: Phaser.ScaleManager.SHOW_ALL
      });

      this.state.add('boot', State.Boot, true);
      this.state.add('preloader', State.Preloader);
      this.state.add('game', State.Game);
    }

    boot() {
      super.boot();
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    }
  }
}

// export Game to window
let Game = LD43.Game;

