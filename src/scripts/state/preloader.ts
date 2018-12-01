module LD43.State {
  export class Preloader extends Phaser.State {
    loadingBar: Entity.PreloadBar;

    preload() {
      this.loadingBar = new Entity.PreloadBar(this.game);

      const img = [
        'bg', 'food_block', 'green_block', 'red_block', 'bag',
        'arrow'
      ];

      img.forEach((file) => {
        this.load.image(file, 'assets/images/' + file + '.png');
      });
    }

    create() {
      this.loadingBar.setFillPercent(100);
      let tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.startGame, this);
    }

    startGame() {
      this.game.state.start('game', true);
    }

    loadUpdate() {
      this.loadingBar.setFillPercent(this.load.progress);
    }
  }
}
