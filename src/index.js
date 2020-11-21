// defined in webpack
/* global ASSET_NAMES */

import { makeSprite, t } from "@replay/core";
import { Animation } from 'playset';
import random from './random';
import { AnimatedSequence } from './animated-sequence';

import * as cansGame from './games/cans';
import * as loafGame from './games/loaf';
import * as skritchesGame from './games/skritches';



const games = {
  'cans': cansGame,
  'loaf': loafGame,
  'skritches': skritchesGame,
};
const timeBetweenLevels = 4000;
// const timeBetweenLevels = 1;
const defaultSpeed = 1;
const speedIncrement = 0.25;


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
      gameList,
      speed,
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
          gameList: random.order(Object.keys(games)),
          speed: defaultSpeed,
        }
      }
      return state;
    }
    
    if (state.gameState === 'between-levels') {
      const timeElapsed = new Date() - state.timeStarted;

      if (lives > 0 && timeElapsed > (timeBetweenLevels / speed)) {
        if (gameList.length === 0) {
          gameList = random.order(Object.keys(games));
          speed += speedIncrement;
        }
        const nextGame = gameList.pop();
        return {
          gameData: games[nextGame].init(),
          timeStarted: new Date(),
          timeRemaining: 5,
          activeGame: nextGame,
          levelsCompleted: state.levelsCompleted + 1,
          lives: state.lives,
          gameState: 'in-level',
          gameList,
          speed,
        }
      }
      return state;
    }
    
    // assume in-level
    
    const timeElapsed = new Date() - timeStarted;
    const timeRemaining = 5 - (timeElapsed / 1000 * speed);

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
      gameList,
      speed,
    }
  },

  render({ state }) {
    
    const {speed} = state;
    
    if (state.gameState === 'start-screen') {
      const title = t.image({
        fileName: 'BC-start.png',
        x: 0,
        y: 0,
        width: 300,
        height: 300,
      });
      const startMessage = AnimatedSequence({
        id: 'start-message-animation',
        x: 0,
        y: 0,
        fps: 1.2,
        frames: [
          [
            /* blank */
          ],
          [
            t.rectangle({
              text: 'Press Spacebar',
              x: 0,
              y: 0,
              width: 180,
              height: 40,
              color: '#FF004D',
            }),
            t.text({
              text: 'Press Spacebar',
              x: 0,
              y: 0,
              font: { name: 'Impact', size: 26 },
              color: '#FFEC27',
            }),
          ],
        ]
      });
      return [
        title,
        startMessage,
      ];
    }
    
    if (state.gameState === 'between-levels') {
      const timeElapsed = new Date() - state.timeStarted;

      let gameOver = null;
      if (state.lives <= 0) {
        gameOver = t.text({
          text: `Game Over`,
          font: { name: 'Impact', size: 24 },
          color: '#FFF1E8',
          x: 0,
          y: 75,
          align: 'center',
        });
      }
      
      let getReady = null;
      if (state.lives > 0 && timeElapsed > (timeBetweenLevels * 0.5 / speed)) {
        getReady = t.text({
          text: `Level ${state.levelsCompleted + 1}`,
          font: { name: 'Impact', size: 24 },
          color: '#FFF1E8',
          x: 0,
          y: 75,
          align: 'center',
        });
      }
      
      const lives = t.text({
        text: `Lives: ${state.lives}`,
        font: { name: 'Impact', size: 20 },
        color: '#FFF1E8',
        x: -120,
        y: -120,
        align: 'left',
      });
      
      let counterArray = [0];
      if (state.lives === 0 && timeElapsed < timeBetweenLevels * 0.5 / speed) {
        counterArray = [3, 4];
      }
      if (state.lives > 0 && timeElapsed < timeBetweenLevels * 0.5 / speed) {
        counterArray = [1, 2];
      }
      if (state.levelsCompleted > 0 && timeElapsed < timeBetweenLevels * 0.5 / speed) {
        if (state.prevGameSuccessful) {
          counterArray = [1, 2];
        } else {
          counterArray = [3, 4];
        }
      }
      const counterImage = Animation({
        id: 'counter-image-animation',
        fileName: 'BC-counter.png',
        width: 300,
        height: 300,
        x: 0,
        y: 0,
        columns: 4,
        rows: 2,
        fps: 2 * speed,
        frameArray: counterArray,
      })
      return [
        counterImage,
        gameOver,
        getReady,
        lives,
      ]
    }
    
    // else assume in-level
    
    const gameContent = games[state.activeGame].render({ state });
    const timeElapsed = new Date() - state.timeStarted;
    const timeRemaining = 5 - (timeElapsed / 1000 * speed);
    
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
    
    let instructions = null;
    if (timeElapsed < 1000) {
      instructions = t.text({
        text: `${games[state.activeGame].instructions}`,
        font: { name: 'Impact', size: 20 },
        color: '#FFF1E8',
        x: 0,
        y: 120,
        align: 'center',
      });
    }
    
    
    const ui = [
      timer,
      timeBar,
      instructions,
    ];
    
    return [
      ...gameContent,
      ...ui,
    ];
  
  },
});
