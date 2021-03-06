module LD43.State {
  export class Preloader extends Phaser.State {
    loadingBar: Entity.PreloadBar;

    preload() {
      const logo = this.add.sprite(this.game.width / 2, 30, 'title');
      logo.anchor.x = 0.5;

      this.loadingBar = new Entity.PreloadBar(this.game);

      const img = [
        'background_bag', 'background_full_2', 'food_block', 'box_green', 'box_red', 'white_arrow',
        'end_screen', 'playagain'
      ];
      const food = ['chickenleg', 'cupcake', 'milk', 'donut', 'watermelon', 'sausage', 'banana'];

      const json = ['food', 'config'];
      const music = ['snackrifice-title', 'snackrifice', 'snackrifice-end'];
      const sfx = ['bag', 'bin', 'close-fridge', 'invalid-drop' , 'pick-up', 'put-down', 'valid-drop'];

      img.forEach((file) => {
        this.load.image(file, 'assets/images/' + file + '.png');
      });

      food.forEach((file) => {
        for (let i = 1; i <= 3; i++) {
          this.load.image('food-' + file + '-' + i, 'assets/images/food/' + file + '_' + i + '.png');
        }
      });

      music.forEach((file) => {
        this.load.audio(file, 'assets/music/' + file + '.mp3');
      });

      sfx.forEach((file) => {
        this.load.audio(file, 'assets/sfx/' + file + '.mp3');
      });

      json.forEach((file) => {
        this.load.json(file, 'assets/data/' + file + '.json');
      });

      // spritesheets
      this.load.spritesheet('arrows', 'assets/images/arrows.png', 89, 55);
      this.load.spritesheet('close-button', 'assets/images/close_button.png', 411, 106);

      this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
      this.loadingBar.setFillPercent(100);
      let tween = this.game.add.tween(this.loadingBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.startGame, this);

      WebFont.load({
        google: {
          families: ['Press Start 2P']
        }
      });
    }

    shutdown() {
      this.loadingBar.loaderImg.destroy();
    }

    loadUpdate() {
      this.loadingBar.setFillPercent(this.load.progress);
    }

    startGame() {
      this.game.state.start('title', false);
      //this.game.state.start('scores', true);
      //this.game.state.start('game', true);
    }
  }
}
