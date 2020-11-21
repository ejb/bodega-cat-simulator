import { makeSprite, t } from "@replay/core";
import random from '../random';

export const instructions = `Balance!`;

export function init() {
  const tilt = random.number([-75, 75]);
  return {
    catX: 0,
    tilt,
    catY: 100,
    boxes: [{
      angle: 1,
      y: 20
    }, {
      angle: 0.5,
      y: -50
    }, {
      angle: 0.25,
      y: -120
    }],
    success: true,
  }
}

export function loop({ state, device }) {
  
  const { gameData, speed } = state;
  let { catX, catY, success, tilt, } = gameData;
  
  if (!success) {
    return {
      ... gameData,
    };
  }
  const tiltSpeed = 1 + ((speed - 1) * 0.01);
  
  if (device.inputs.keysDown.ArrowLeft) {
    catX -= 0.75 * tiltSpeed;
  } else if (device.inputs.keysDown.ArrowRight) {
    catX += 0.75 * tiltSpeed;
  }
  
  tilt = (tilt + (tilt * 0.005) + (catX * 2)) * tiltSpeed;
  
  catX += tilt * 0.0003;
  
  if (Math.abs(catX) > 60) {
    success = false;
    catY = -100;
    catX = 100 * Math.sign(tilt);
  }
  
  return {
    ...gameData,
    catX,
    catY,
    tilt,
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
  
  const positionOffset = (gameData.position * 75) - 75;
      
  const cat = t.image({
    fileName: 'BC-balance-cat.png',
    width: 100,
    height: 100,
    x: gameData.catX,
    y: gameData.catY,
  });
  
  const boxes = gameData.boxes.map((box, i) => {
    return t.rectangle({
      color: 'brown',
      width: 70,
      height: 70,
      x: gameData.tilt * 0.01 * box.angle,
      y: box.y,
      rotation: gameData.tilt * 0.002 * box.angle,
    });
  });

  
  return [
    background,
    ... boxes,
    cat,
  ]
}