// defined in webpack
/* global ASSET_NAMES */

import { makeSprite, t } from "@replay/core";

import * as cansGame from './cans';

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
      posX: 0,
      posY: 0,
      targetX: 0,
      targetY: 0,
    };
  },

  loop({ state, device }) {
    const { pointer } = device.inputs;
    const { posX, posY } = state;
    let { targetX, targetY } = state;

    if (pointer.justPressed) {
      device.audio("boop.wav").play();
      targetX = pointer.x;
      targetY = pointer.y;
    }
    
    if (typeof state.gameData === 'undefined') {
      state.gameData = cansGame.init();
    }
    
    const gameData = cansGame.loop({ state, device });

    return {
      gameData,
    }
  },

  render({ state }) {
    
    return cansGame.render({ state });
  
  },
});
