import { makeSprite, t } from "@replay/core";
import random from '../random';

export const instructions = `Pose!`;

const moveList = ['Up', 'Down', 'Left', 'Right'];

export function init() {
  const moves = random.order(moveList);
  return {
    moves: moves.slice(0, 3),
    startPose: moves[3],
    poseCount: 0,
    success: false,
  }
}

export function loop({ state, device }) {
  
  const { gameData, speed } = state;
  let { moves, poseCount, success, startPose } = gameData;
  
  if (success) {
    let { ticker = 0 } = gameData;
    return {
      ... gameData,
      ticker: ticker + 1,
    }
  }
  
  const nextMove = moves[poseCount];
  if (device.inputs.keysJustPressed[`Arrow${nextMove}`]) {
    poseCount += 1;
  }
  
  if (poseCount === moves.length) {
    success = true;
  }
  
  return {
    moves,
    poseCount,
    success,
    startPose,
  };

}

export function render({ state }) {
  
  const { gameData = {}, speed } = state;
  
  const background = t.rectangle({
    width: 300,
    height: 300,
    x: 0,
    y: 0,
    color: '#1D2B53',
  });

  const catIndexDict = {
    'Up': 1,
    'Down': 2,
    'Left': 3,
    'Right': 4,
  }
  
  if (gameData.success && gameData.ticker > 30) {
    const phone = t.spriteSheet({
      fileName: 'BC-insta.png',
      width: 300,
      height: 300,
      x: 0,
      y: 0,
      columns: 4,
      rows: 2,
      index: 5,
    });
  
    const phoneCat = t.spriteSheet({
      fileName: 'BC-insta.png',
      width: 300 * 0.6,
      height: 300 * 0.6,
      x: -8,
      y: 0,
      columns: 4,
      rows: 2,
      index: catIndexDict[gameData.moves[gameData.poseCount - 1]],
    });
    
    return [
      phone,
      phoneCat,
    ];
  
  }
  
  let nextMove = gameData.moves[gameData.poseCount - 1];
  if (typeof nextMove === 'undefined') {
    nextMove = gameData.startPose;
  }
  const catIndex = catIndexDict[nextMove];
  const cat = t.spriteSheet({
    fileName: 'BC-insta.png',
    width: 300,
    height: 300,
    x: 0,
    y: 0,
    columns: 4,
    rows: 2,
    index: catIndex,
  });
  
  const phone = t.spriteSheet({
    fileName: 'BC-insta.png',
    width: 300,
    height: 300,
    x: 0,
    y: 0,
    columns: 4,
    rows: 2,
    index: 0,
  });
  
  const phoneCat = t.spriteSheet({
    fileName: 'BC-insta.png',
    width: 300 * 0.211,
    height: 300 * 0.211,
    x: 5,
    y: -95,
    columns: 4,
    rows: 2,
    index: catIndex,
  });
  
  let instruction = null;
  if (!gameData.success) {
    instruction = t.text({
      text: `${gameData.moves[gameData.poseCount]}!`
    })
  }
  
  
  return [
    background,
    cat,
    phone,
    phoneCat,
    instruction,
  ]
}