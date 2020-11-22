import { makeSprite, t } from "@replay/core";
import random from '../random';

export const instructions = `Catch!`;

const catchRange = 50;

export function init() {
  return {
    mouseX: 165,
    pawDown: false,
    success: false,
  }
}

export function loop({ state, device }) {
  
  const { gameData, speed } = state;
  let { mouseX, success, pawDown } = gameData;
  
  if (gameData.success) {
    return {
      ... gameData,
    };
  }
  
  mouseX -= 1.5 * speed;
  
  if (!pawDown && device.inputs.keysJustPressed[' ']) {
     pawDown = true;
     console.log(mouseX)
     if (mouseX > - catchRange - 10 && mouseX < catchRange - 10) {
       success = true;
     }
  }
    
  return {
    pawDown,
    mouseX,
    success,
  }

}


export function render({ state }) {
  
  const { gameData = {} } = state;
  
  const background = t.spriteSheet({
    fileName: 'BC-catch-frames.png',
    width: 300,
    height: 300,
    columns: 4,
    rows: 2,
    index: 4,
  });
    
  let catFrame = 0;
  if (gameData.pawDown && gameData.success) {
    catFrame = 1;
  } else if (gameData.pawDown) {
    catFrame = 2;
  }
  const cat = t.spriteSheet({
    fileName: 'BC-catch-frames.png',
    width: 300,
    height: 300,
    columns: 4,
    rows: 2,
    index: catFrame,
  });
  
  const mouse = t.image({
    fileName: 'BC-catch-mouse.png',
    width: 85,
    height: 23,
    x: gameData.mouseX,
    y: -66,
  });
  
  let paw = null;
  if (gameData.pawDown) {
    paw = t.spriteSheet({
      fileName: 'BC-catch-frames.png',
      width: 300,
      height: 300,
      columns: 4,
      rows: 2,
      index: 3,
    });    
  }
  
  
  
  return [
    background,
    cat,
    mouse,
    paw,
  ]
}