import { t, makeSprite } from '@replay/core';

const requiredProps = [
  'id',
  'fps',
  'frames',
];

export const AnimatedSequence = makeSprite({
  init({ props }) {
    
    const missingProps = requiredProps.filter(prop => {
      return (props.hasOwnProperty(prop) === false);
    });
    if (missingProps.length > 0) {
      throw(`AnimatedSequence is missing required prop(s): ${missingProps.join(', ')}`)
    }
    
    return {
      frame: 0,
      tick: 0
    };
  },

  loop({ state, props }) {
    
    const {frames, fps} = props; 

    if (!frames) {
      debugger;
    }

    const totalFrames = frames.length;    
    const ticksPerFrame = 60 / fps; // 7.5
    
    let frame = state.frame;
    if (props.playing !== false) {
      let frameIndex = Math.round(state.tick / ticksPerFrame);
      if (frameIndex >= totalFrames) {
        if (props.loop === false) {
          frameIndex = totalFrames - 1;
        }
        frameIndex = frameIndex % totalFrames;
      }
      frame = frameIndex;
    }
        
    return {
      frame,
      tick: state.tick + 1
    };
  },

  render({ state, props }) {
    
    const { frames } = props;
    const { frame } = state;
    
    const frameSprites = frames[frame];
        
    return [
      ... frameSprites,
    ];
  },
});