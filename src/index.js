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
      gameState: 'start-screen',
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
    
    if (state.gameState === 'start-screen') {
      if (device.inputs.keysJustPressed[' ']) {
        // start new round
        return {
          gameData: null,
          activeGame: null,
          levelsCompleted: 0,
          lives: 3,
          gameState: 'between-levels',
          timeStarted: new Date(),
        }
      }
      return state;
    }
    
    if (state.gameState === 'between-levels') {
      const timeElapsed = new Date() - state.timeStarted;

      if (lives > 0 && timeElapsed > 1000) {
        const nextGame = 'cans';
        return {
          gameData: games[nextGame].init(),
          timeStarted: new Date(),
          timeRemaining: 5,
          activeGame: nextGame,
          levelsCompleted: state.levelsCompleted + 1,
          lives: state.lives,
          gameState: 'in-level',
        }
      }
      return state;
    }
    
    // assume in-level
    
    const timeElapsed = new Date() - timeStarted;
    const timeRemaining = 5 - (timeElapsed / 1000);

    let gameData = null;
    if (timeRemaining > 0) {
      gameData = games[activeGame].loop({ state, device });
      prevGameSuccessful = gameData.success;
    } else {
      // game over
      activeGame = null;
      if (prevGameSuccessful === false) {
        lives -= 1;
      }
    }
    
    return {
      gameData,
      timeStarted: timeRemaining > 0 ? timeStarted : new Date(),
      activeGame,
      prevGameSuccessful,
      levelsCompleted,
      lives,
      gameState: timeRemaining > 0 ? 'in-level' : 'between-levels',
    }
  },

  render({ state }) {
    
    if (state.gameState === 'start-screen') {
      const title = t.text({
        text: 'BODEGA CAT SIMULATOR',
        font: { name: 'Impact', size: 26 },
        color: '#FF004D',
        x: 0,
        y: 0,
      });
      return [
        title,
      ];
    }
    
    if (state.gameState === 'between-levels') {
      let prevGameSuccessful = null;
      if (state.levelsCompleted > 0) {
        prevGameSuccessful = t.text({
          text: state.prevGameSuccessful ? 'Passed' : 'Failed',
          font: { name: 'Impact', size: 20 },
          color: '#222',
          x: -120,
          y: 140,
          align: 'left',
        });
      }
      const nextLevel = t.text({
        text: state.lives > 0 ? `Level ${state.levelsCompleted + 1}` : `Game Over`,
        font: { name: 'Impact', size: 24 },
        color: '#222',
        x: 0,
        y: 0,
        align: 'center',
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
        prevGameSuccessful,
        nextLevel,
        lives,
      ]
    }
    
    // else assume in-level
    
    const gameContent = games[state.activeGame].render({ state });
    const timeElapsed = new Date() - state.timeStarted;
    const timeRemaining = 5 - (timeElapsed / 1000);
    
    const timer = t.text({
      text: timeRemaining.toFixed(1),
      font: { name: 'Impact', size: 16 },
      x: -140,
      y: -130,
      color: 'white',
      align: 'left',
    });
    
    const timeBarWidth = 280 * (timeRemaining / 5);
    const timeBar = t.rectangle({
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
