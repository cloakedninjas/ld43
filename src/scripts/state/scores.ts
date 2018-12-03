module LD43.State {
  export class Scores extends Phaser.State {
    game: LD43.Game;
    scores: {
      fridge: Score,
      discarded: Score,
      empty: Score
    };

    total: number;

    init(scores) {
      this.scores = scores;
      this.total = this.scores.fridge.score + this.scores.discarded.score + this.scores.empty.score;
    }

    create() {
      this.add.sprite(0, 0, 'end_screen');

      let fontStyle: Phaser.PhaserTextStyle = {
        font: 'Press Start 2P',
        fontSize: 30,
        fill: '#6E5772'
      };

      // final score
      let text = this.game.add.text(317, 420, this.total.toString(), fontStyle);
      text.anchor.set(0.5);

      fontStyle.fontSize = 15;

      const qtyX = 320,
            scoreX = 400;

      // fridge
      text = this.game.add.text(qtyX, 615, this.scores.fridge.qty.toString(), fontStyle);
      text.anchor.set(0.5);

      text = this.game.add.text(scoreX, 634, this.scores.fridge.score.toString(), fontStyle);
      text.anchor.set(0.5);

      // discarded
      text = this.game.add.text(qtyX, 687, this.scores.discarded.qty.toString(), fontStyle);
      text.anchor.set(0.5);

      text = this.game.add.text(scoreX, 707, this.scores.discarded.score.toString(), fontStyle);
      text.anchor.set(0.5);

      // empty

      text = this.game.add.text(qtyX, 758, this.scores.empty.qty.toString(), fontStyle);
      text.anchor.set(0.5);

      text = this.game.add.text(scoreX, 778, this.scores.empty.score.toString(), fontStyle);
      text.anchor.set(0.5);

      this.game.soundManager.playMusic('end');
    }
  }
}
