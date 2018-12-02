module LD43.State {
  export class Preloader extends Phaser.State {
    loadingBar: Entity.PreloadBar;

    preload() {
      const logo = this.add.sprite(this.game.width / 2, 200, 'phaser');
      logo.anchor.x = 0.5;

      this.loadingBar = new Entity.PreloadBar(this.game);

      const img = [
        'bg', 'food_block', 'green_block', 'red_block', 'arrow'
      ];
      const food = ['cake', 'chickenleg', 'cupcake', 'milk'];

      const json = ['food', 'config'];
      const music = ['title'];

      img.forEach((file) => {
        this.load.image(file, 'assets/images/' + file + '.png');
      });

      food.forEach((file) => {
        for (let i = 1; i <= 1; i++) {
          this.load.image('food-' + file + '-' + i, 'assets/images/food/' + file + '_' + i + '.png');
        }
      });

      music.forEach((file) => {
        this.load.audio(file, 'assets/music/' + file + '.mp3');
      });

      json.forEach((file) => {
        this.load.json(file, 'assets/data/' + file + '.json');
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
