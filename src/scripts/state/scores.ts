module LD43.State {
  export class Scores extends Phaser.State {
    create() {
      this.add.sprite(0, 0, 'end_screen');

      let fontStyle: Phaser.PhaserTextStyle = {
        font: 'Press Start 2P',
        fontSize: 30,
        fill: '#6E5772'
      };

      // final score
      let text = this.game.add.text(317, 420, '99899', fontStyle);
      text.anchor.set(0.5);

      fontStyle.fontSize = 15;

      const qtyX = 320,
            scoreX = 400;

      // fridge
      text = this.game.add.text(qtyX, 615, '1234', fontStyle);
      text.anchor.set(0.5);

      text = this.game.add.text(scoreX, 634, '5678', fontStyle);
      text.anchor.set(0.5);

      // discarded
      text = this.game.add.text(qtyX, 687, '1234', fontStyle);
      text.anchor.set(0.5);

      text = this.game.add.text(scoreX, 707, '5678', fontStyle);
      text.anchor.set(0.5);

      // spoiled

      text = this.game.add.text(qtyX, 758, '1234', fontStyle);
      text.anchor.set(0.5);

      text = this.game.add.text(scoreX, 778, '5678', fontStyle);
      text.anchor.set(0.5);


      // empty

      text = this.game.add.text(qtyX, 830, '1234', fontStyle);
      text.anchor.set(0.5);

      text = this.game.add.text(scoreX, 850, '5678', fontStyle);
      text.anchor.set(0.5);
    }
  }
}
