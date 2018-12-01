module LD43.Lib {
  export class SoundManager {
    game: Phaser.Game;
    musicTracks: any;
    currentTrack: Phaser.Sound;

    constructor(game: Phaser.Game) {
      this.game = game;

      this.musicTracks = {
        'title': new Phaser.Sound(game, 'title')
      };
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
    }
  }
}
