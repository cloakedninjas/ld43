module LD43.Lib {
  export class SoundManager {
    game: Phaser.Game;
    musicTracks: any;
    sfx: any;
    currentTrack: Phaser.Sound;

    constructor(game: Phaser.Game) {
      this.game = game;

      if (localStorage.getItem('ld43-mute') === '1') {
        game.sound.mute = true;
      }

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

    playMusic(track: string, fadeIn: boolean = true, fadeOutCurrent: boolean = true, loop: boolean = false) {
      if (this.currentTrack && this.currentTrack.isPlaying) {
        if (fadeOutCurrent) {
          this.currentTrack.fadeOut(500);
        } else {
          this.currentTrack.stop();
        }
      }

      let newTrack: Phaser.Sound = this.musicTracks[track];

      if (fadeIn) {
        newTrack.fadeIn(500, loop);
      } else {
        newTrack.play(null, null, null, loop);
      }

      this.currentTrack = newTrack;
    }

    playSfx(key) {
      this.sfx[key].play();
    }
  }
}
