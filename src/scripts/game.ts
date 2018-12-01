/// <reference path="../refs.d.ts" />

module LD43 {
  export class Game extends Phaser.Game {
    soundManager: Lib.SoundManager;

    constructor() {
      super({
        width: 800,
        height: 1360,
        renderer: Phaser.AUTO,
        scaleMode: Phaser.ScaleManager.SHOW_ALL
      });

      this.state.add('boot', State.Boot, true);
      this.state.add('preloader', State.Preloader);
      this.state.add('menu', State.Menu);
      this.state.add('game', State.Game);
      this.state.add('scores', State.Scores);
    }

    boot() {
      super.boot();
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;

      this.soundManager = new Lib.SoundManager(this);
    }
  }
}

// export Game to window
let Game = LD43.Game;

