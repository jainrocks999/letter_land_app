import Sound from 'react-native-sound';
import TTSEventService from './ttsEvents.service';
import { AppState, Image, Platform } from 'react-native';

// const MUSIC_VOLUME=0.35;
const MUSIC_VOLUME = 0.15;
const DUCKED_VOLUME = 0.08;
const EFFECT_VOLUME = 0.8;

const toUri = (asset: number) => Image.resolveAssetSource(asset).uri;

const TRACK_FILES = {
  home: toUri(require('../assets/audio/home-music.mp3')),
  activity: toUri(require('../assets/audio/activity-music.mp3')),
};

const EFFECT_FILES = {
  levelComplete: toUri(require('../assets/audio/completion-of-a-level.wav')),
  getReward: toUri(require('../assets/audio/game-level-completed.wav')),
};

export type TrackName= keyof typeof TRACK_FILES;
export type EffectName = keyof typeof EFFECT_FILES;

// Sound.setCategory('Ambient',true);
Sound.setCategory(Platform.OS === 'ios' ? 'Ambient' : 'Playback', true);

const tracks: Partial<Record<TrackName, Sound>> = {};
const effects: Partial<Record<EffectName, Sound>> = {};

let currentTrack:TrackName='home';
let isInitialized = false;
let isEnabled = true;
let isEffectPlaying = false;
let removeTTSListeners: (() => void) | null = null;

const getCurrentTrack=()=> tracks[currentTrack];

const MusicService = {
  init: () => {
    if (isInitialized) return;
    isInitialized = true;

    (Object.keys(TRACK_FILES) as TrackName[]).forEach(name=>{
      const track=new Sound(TRACK_FILES[name],'',error=>{
        if(error){
           console.log('Music load Error', error);
           track.release();
           return;
        }
        track.setNumberOfLoops(-1);
        track.setVolume(MUSIC_VOLUME);
        tracks[name]=track;

        if(name===currentTrack) MusicService.play();
      });
    });

    (Object.keys(EFFECT_FILES) as EffectName[]).forEach(name => {
      const effect = new Sound(EFFECT_FILES[name], '', error => {
        if (error) {
          console.log(`Effect load Error (${name})`, error);
          effect.release();
          return;
        }
        effect.setVolume(EFFECT_VOLUME);
        effects[name] = effect;
      });
    });

    // TTSEventService.addListeners({
    //   onStart: () => music?.setVolume(DUCKED_VOLUME),
    //   onFinish: () => music?.setVolume(MUSIC_VOLUME),
    //   onCancel: () => music?.setVolume(MUSIC_VOLUME),
    // });

    removeTTSListeners = TTSEventService.addListeners({
      onStart: () => getCurrentTrack()?.setVolume(DUCKED_VOLUME),
      onFinish: () => getCurrentTrack()?.setVolume(MUSIC_VOLUME),
      onCancel: () => getCurrentTrack()?.setVolume(MUSIC_VOLUME),
    });
  },

  setTrack:(name:TrackName)=>{
    if(name===currentTrack) return;

    getCurrentTrack()?.pause();
    currentTrack=name;
    getCurrentTrack()?.setVolume(MUSIC_VOLUME);
    if(AppState.currentState==='active'){
      MusicService.play();
    }
  },

  play: () => {
    const track= getCurrentTrack();
    if (!track || !isEnabled || isEffectPlaying) return;
    track.play(success => {
      if (!success) console.log('Music playback failed');
    });
  },

  pause: () => {
    (Object.keys(tracks) as TrackName[]).forEach(name=>tracks[name]?.pause());
  },

  setEnabled: (enabled: boolean) => {
    isEnabled = enabled;
    if (enabled) {
      MusicService.play();
    } else {
      MusicService.pause();
    }
  },

  playEffect: (name: EffectName) => {
    const effect = effects[name];
    if (!effect) return;

    isEffectPlaying = true;
    getCurrentTrack()?.pause();

    effect.stop(() => {
      effect.play(() => {
        isEffectPlaying = false;

        if (AppState.currentState === 'active') {
          MusicService.play();
        }
      });
    });
  },
  stopEffects: () => {
    (Object.keys(effects) as EffectName[]).forEach(name =>
      effects[name]?.stop(),
    );
    isEffectPlaying = false;
  },
  release: () => {
    (Object.keys(tracks)as TrackName[]).forEach(name=>{
      tracks[name]?.stop();
      tracks[name]?.release();
      delete tracks[name];
    });
    (Object.keys(effects) as EffectName[]).forEach(name => {
      effects[name]?.release();
      delete effects[name];
    });
    isEffectPlaying = false;
    isInitialized=false;
    removeTTSListeners?.();
    removeTTSListeners = null;
  },
};
export default MusicService;
