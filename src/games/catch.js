import { makeSprite, t } from "@replay/core";
import random from '../random';

export const instructions = `Catch!`;

const catchRange = 50;

export function init() {
  return {
    mouseX: 165,
    mouseSpeed: 1.5,
    mouseAcceleration: 1,
    pawDown: false,
    success: false,
    delay: random.number([50, 100]),
    ticker: 0,
  }
}

export function loop({ state, device }) {
  
  const { gameData, speed } = state;
  let { mouseX, success, pawDown, mouseSpeed, mouseAcceleration, delay, ticker } = gameData;
  
  if (gameData.success) {
    return {
      ... gameData,
    };
  }
  
  if (ticker > delay / speed) {
    mouseAcceleration += random.number([-0.02, 0.02]);
    mouseSpeed *= mouseAcceleration;
    if (mouseSpeed < 1.5) {
      mouseSpeed = 1.5;
      mouseAcceleration = 1;
    }
    if (mouseSpeed > 4) {
      mouseSpeed = 4;
    }
    mouseX -= mouseSpeed * speed;
  }
  
  if (!pawDown && device.inputs.keysJustPressed[' ']) {
     if (mouseX > - catchRange - 10 && mouseX < catchRange - 10) {
       success = true;
       device.audio('445958__breviceps__cartoon-bat-mouse-squeak.mp3').play();
     } else {
       device.audio('146968__zabuhailo__catgrowls.wav').play();
     }
     pawDown = true;
  }
    
  return {
    pawDown,
    mouseX,
    mouseSpeed,
    mouseAcceleration,
    success,
    delay,
    ticker: ticker + 1,
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