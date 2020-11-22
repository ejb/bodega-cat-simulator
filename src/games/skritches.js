import { makeSprite, t } from "@replay/core";
import random from '../random';

export const instructions = `Get skritches!`;

export function init() {
  const arms = [{
    start: 0,
    x: random.number([-100, 100]),
    y: 250,
    index: random.integer([0, 4]),
  }];
  return {
    targetX: 0,
    x: 0,
    y: -100,
    success: false,
    arms,
  }
}

export function loop({ state, device }) {
  
  const { gameData, speed } = state;
  let { targetX, x, y, success, arms } = gameData;
  
  if (gameData.success) {
    return {
      ... gameData,
    };
  }
  
  if (device.inputs.keysDown.ArrowLeft) {
     targetX -= 1 * speed;
  } else if (device.inputs.keysDown.ArrowRight) {
     targetX += 1 * speed;
  }
  
  arms.forEach(arm => {
    arm.y -= 0.95 * speed;
    if (arm.y <= 50) {
      arm.y = 50;
    }
    
    if (arm.y <= 50 && Math.abs(arm.x - x) < 50) {
      success = true;
      device.audio('24021__dwsolo__themba4.wav').play();
    }
  });
  
  
  
  return {
    x: x + (targetX - x) / 10,
    y,
    targetX,
    arms,
    success,
  }

}


export function render({ state }) {
  
  const { gameData = {} } = state;
  
  const background = t.rectangle({
    width: 300,
    height: 300,
    x: 0,
    y: 0,
    color: '#222',
  });
    
  const cat = t.spriteSheet({
    fileName: 'BC-skritches-cat.png',
    width: 300,
    height: 300,
    x: gameData.x,
    y: gameData.y,
    columns: 3,
    rows: 1,
    index: gameData.success ? 1 : 2,
  });
  
  const arms = gameData.arms.map((arm, i) => {
    return t.spriteSheet({
      fileName: 'BC-skritches-arms.png',
      width: 100,
      height: 200,
      x: arm.x,
      y: arm.y,
      columns: 5,
      rows: 1,
      index: arm.index,
    });
  });
  
  return [
    background,
    cat,
    ... arms,
  ]
}