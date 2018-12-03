module LD43.Lib {
  export class SoundManager {
    game: Phaser.Game;
    musicTracks: any;
    sfx: any;
    currentTrack: Phaser.Sound;

    constructor(game: Phaser.Game) {
      this.game = game;

      this.musicTracks = {
        'title': new Phaser.Sound(game, 'snackrifice-title', 1, true),
        'game': new Phaser.Sound(game, 'snackrifice', 1, true),
        'end': new Phaser.Sound(game, 'snackrifice-end', 1),
      };

      this.sfx = {};

      const sfx = ['bag', 'bin', 'close-fridge', 'invalid-drop' , 'pick-up', 'put-down', 'valid-drop'];

      sfx.forEach((file) => {
        this.sfx[file] = new Phaser.Sound(game, file);
      }, this);
    }

    playMusic(track: string, fadeIn: boolean = false, fadeOutCurrent: boolean = false) {
      if (this.currentTrack && this.currentTrack.isPlaying) {
        if (fadeOutCurrent) {
          this.currentTrack.fadeOut(1000);
        } else {
          this.currentTrack.stop();
        }
      }

      let newTrack: Phaser.Sound = this.musicTracks[track];

      if (fadeIn) {
        newTrack.fadeIn(1000);
      } else {
        newTrack.play();
      }

      this.currentTrack = newTrack;
    }

    playSfx(key) {
      this.sfx[key].play();
    }
  }
}
