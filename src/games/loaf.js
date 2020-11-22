import { makeSprite, t } from "@replay/core";
import random from '../random';

export const instructions = `Match!`;

const cats = [{
  size: 'large',
  index: 0,
}, {
  size: 'long',
  index: 1,
}, {
  size: 'tall',
  index: 2,
}]

const boxes = [{
  size: 'large',
  index: 0,
}, {
  size: 'long',
  index: 1,
}, {
  size: 'tall',
  index: 2,
}, {
  size: 'too-small',
  index: 12,
}];

export function init() {
  const boxesSelected = random.selection(boxes, 3);
  const correctBox = boxesSelected.find(b => b.index < 3);
  const cat = cats.find(cat => cat.index === correctBox.index);
  return {
    cat,
    boxes: random.order(boxesSelected),
    position: 1,
    success: false,
  }
}

export function loop({ state, device }) {
  
  const { gameData } = state;
  let { position, success } = gameData;
  
  if (gameData.success) {
    return {
      ... gameData,
      timeInBox: (gameData.timeInBox || 0) + 1,
    };
  }
  
  const soundEffect = device.audio('515823__matrixxx__select-granted-04.mp3');
  
  if (device.inputs.keysJustPressed.ArrowLeft) {
    position -= 1;
    soundEffect.play();
  } else if (device.inputs.keysJustPressed.ArrowRight) {
    position += 1;
    soundEffect.play();
  }
  
  if (position < 0) {
    position = 0;
  } else if (position > 2) {
    position = 2;
  }
  
  if (device.inputs.keysJustPressed[' '] || device.inputs.keysJustPressed.ArrowDown) {
    soundEffect.play();
    if (gameData.boxes[position].index === gameData.cat.index) {
      success = true;
    }
  }
  
  return {
    ...gameData,
    position,
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
    
  let catY = 50;
  if (gameData.success) {
    catY = -50;
  }
  
  const cat = t.spriteSheet({
    fileName: 'BC-loaf.png',
    width: 100,
    height: 100,
    x: positionOffset,
    y: catY,
    columns: 12,
    rows: 6,
    index: gameData.cat.index + 9,
  });
  
  const boxes = gameData.boxes.map((box, i) => {
    return t.spriteSheet({
      fileName: 'BC-loaf.png',
      width: 100,
      height: 100,
      x: (i * 75) - 75,
      y: -50,
      columns: 12,
      rows: 6,
      index: box.index + 6,
    });
  });

  const boxInsides = gameData.boxes.map((box, i) => {
    return t.spriteSheet({
      fileName: 'BC-loaf.png',
      width: 100,
      height: 100,
      x: (i * 75) - 75,
      y: -50,
      columns: 12,
      rows: 6,
      index: box.index + 36,
    });
  });

  
  const leftArrow = t.spriteSheet({
    x: -50 + positionOffset,
    y: 50,
    fileName: 'BC-loaf.png',
    width: 100,
    height: 100,
    columns: 12,
    rows: 6,
    index: 13,
    opacity: (!gameData.success && gameData.position > 0) ? 1 : 0,
  });

  const rightArrow = t.spriteSheet({
    x: 50 + positionOffset,
    y: 50,
    fileName: 'BC-loaf.png',
    width: 100,
    height: 100,
    columns: 12,
    rows: 6,
    index: 14,
    opacity: (!gameData.success && gameData.position < 2) ? 1 : 0,
  });
  
  let heart = null;
  if (gameData.success && gameData.timeInBox > 40 / state.speed) {
    heart = t.spriteSheet({
      x: positionOffset - 30,
      y: 20,
      fileName: 'BC-loaf.png',
      width: 100,
      height: 100,
      columns: 12,
      rows: 6,
      index: 24,
    });
  }
  
  return [
    background,
    leftArrow,
    rightArrow,
    ... boxes,
    cat,
    ... boxInsides,
    heart,
  ]
}