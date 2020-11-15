import { makeSprite, t } from "@replay/core";


export function init() {
  return {
    hits: 0,
    lastHitTime: 0,
  }
}

const hitLength = 200;
const maxHits = 9;

export function loop({ state, device }) {
  
  const { gameData } = state;
  let { lastHitTime, hits } = gameData;
  
  const now = new Date();
  const timeSinceLastHit = now - lastHitTime;
  
  
  if (hits < maxHits && timeSinceLastHit > hitLength && device.inputs.keysJustPressed[' ']) {
    hits += 1;
    lastHitTime = new Date();
  }
  
  const showShout = gameData.hits >= maxHits && timeSinceLastHit > 700;
  
  const success = hits >= maxHits;
  
  return {
    hits,
    lastHitTime,
    timeSinceLastHit,
    showShout,
    success,
  };

}

export function render({ state }) {
  
  const { gameData = {} } = state;
  
  const background = t.rectangle({
    width: 300,
    height: 300,
    x: 0,
    y: 0,
    color: '#222',
  })
  
  const catIndex = gameData.timeSinceLastHit > hitLength ? 0 : 1;
  const cat = t.spriteSheet({
    fileName: 'BC-cans-cat.png',
    width: 130,
    height: 150,
    x: -50,
    y: 0,
    columns: 2,
    rows: 1,
    index: catIndex,
  });
  
  let shout = null;
  if (gameData.showShout) {
    shout = t.image({
        fileName: 'BC-cans-shout.png',
        width: 120,
        height: 55,
        x: 0,
        y: 120,
      });
  }
  
  const stackIndex = gameData.hits < maxHits ? 0 : 1; 
  const stack = t.spriteSheet({
    fileName: 'BC-cans-stack.png',
    width: 150,
    height: 150,
    x: 75,
    y: 0,
    columns: 3,
    rows: 1,
    index: stackIndex,
  });
  
  let fallenCan = null;
  if (gameData.hits >= maxHits) {
    fallenCan = t.spriteSheet({
      fileName: 'BC-cans-stack.png',
      width: 150,
      height: 150,
      x: 60,
      y: 0,
      columns: 3,
      rows: 1,
      index: 2,
    });
  }
  
  let nettingIndex = Math.ceil(gameData.hits / 2);
  const netting = t.spriteSheet({
    fileName: 'BC-cans-netting.png',
    width: 150,
    height: 150,
    x: 75,
    y: 0,
    columns: 4,
    rows: 2,
    index: nettingIndex,
  });
  
  return [
    background,
    stack,
    netting,
    fallenCan,
    cat,
    shout,
  ]
}