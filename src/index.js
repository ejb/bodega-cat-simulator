// defined in webpack
/* global ASSET_NAMES */

import { makeSprite, t } from "@replay/core";

import * as cansGame from './cans';
const games = {
  'cans': cansGame,
};

export const options = {
  loadingTextures: [
    t.text({
      color: "black",
      text: "Loading...",
    }),
  ],
  assets: ASSET_NAMES,
  dimensions: "scale-up",
};

export const gameProps = {
  id: "Game",
  size: {
    width: 300,
    height: 300,
  },
  defaultFont: {
    name: "Arial",
    size: 14,
  },
};

export const Game = makeSprite({
  init() {
    return {
      gameData: null,
      timeStarted: Date.now(),
      timeRemaining: 5,
      activeGame: null,
      levelsCompleted: 0,
      lives: 3,
    };
  },

  loop({ state, device }) {
    let {
      timeStarted, 
      activeGame, 
      prevGameSuccessful, 
      levelsCompleted,
      lives,
    } = state;
    
    if (lives > 0 && activeGame === null && device.inputs.keysJustPressed[' ']) {
      activeGame = 'cans';
      state.gameData = games[activeGame].init();
      timeStarted = new Date();
    }
    
    const timeElapsed = new Date() - timeStarted;
    const timeRemaining = 5 - (timeElapsed / 1000);

    let gameData = null;
    if (activeGame && timeRemaining > 0) {
      gameData = games[activeGame].loop({ state, device });
      prevGameSuccessful = gameData.success;
    } else if (activeGame) {
      // game over
      activeGame = null;
      levelsCompleted += 1;
      if (prevGameSuccessful === false) {
        lives -= 1;
      }
    }
    
    return {
      gameData,
      timeStarted,
      timeRemaining,
      activeGame,
      prevGameSuccessful,
      levelsCompleted,
      lives,
    }
  },

  render({ state }) {
    
    if (state.activeGame === null) {
      const title = t.text({
        text: 'BODEGA CAT SIMULATOR',
        font: { name: 'Impact', size: 26 },
        color: '#FF004D',
        x: 0,
        y: 0,
      });
      const prevGameSuccessful = t.text({
        text: state.prevGameSuccessful ? 'Passed' : 'Failed',
        font: { name: 'Impact', size: 20 },
        color: '#222',
        x: -120,
        y: -140,
        align: 'left',
      });
      const levelsCompleted = t.text({
        text: `Level ${state.levelsCompleted + 1}`,
        font: { name: 'Impact', size: 20 },
        color: '#222',
        x: -120,
        y: -120,
        align: 'left',
      });
      const lives = t.text({
        text: `Lives: ${state.lives}`,
        font: { name: 'Impact', size: 20 },
        color: '#222',
        x: -120,
        y: -100,
        align: 'left',
      });
      return [
        title,
        prevGameSuccessful,
        levelsCompleted,
        lives,
      ]
    }
    
    const gameContent = games[state.activeGame].render({ state });
    
    const timer = t.text({
      text: state.timeRemaining.toFixed(1),
      font: { name: 'Impact', size: 16 },
      x: -140,
      y: -130,
      color: 'white',
      align: 'left',
    });
    
    const timeBarWidth = 280 * (state.timeRemaining / 5);
    const timeBar = t.rectangle({
      text: state.timeRemaining.toFixed(1),
      x: (280 - timeBarWidth) * -0.5,
      y: -140,
      width: timeBarWidth,
      height: 1,
      color: 'white',
    });
    
    const ui = [
      timer,
      timeBar,
    ];
    
    return [
      ...gameContent,
      ...ui,
    ];
  
  },
});
