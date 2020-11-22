import { t, makeSprite } from '@replay/core';

const requiredProps = [
  'id',
  'duration',
  'children',
];

export const Transition = makeSprite({
  init({ props }) {
    
    const missingProps = requiredProps.filter(prop => {
      return (props.hasOwnProperty(prop) === false);
    });
    if (missingProps.length > 0) {
      throw(`Transition is missing required prop(s): ${missingProps.join(', ')}`)
    }
    
    return {
      tick: 0,
    };
  },

  loop({ state, props }) {
            
    return {
      tick: state.tick + 1,
    };
  },

  render({ state, props }) {
    
    let progress = state.tick / props.duration;
    if (progress > 1) {
      progress = 1;
    }
    
    if (props.reverse) {
      progress = 1 - progress;
    }
    
    const container = TransitionContainer({
      children: props.children,
      scaleX: progress,
      scaleY: progress,
    });
        
    return [
      container,
    ];
  },
});

const TransitionContainer = makeSprite({
  render({ props }) {
    return props.children;
  }
});