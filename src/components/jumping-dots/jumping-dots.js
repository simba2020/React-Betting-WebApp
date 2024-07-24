import React from 'react';
import classes from './jumping-dots.module.scss';

export const JumpingDots = () => {
  return (
    <div className={classes.loading_div}>
      <div className={classes.jumping_dots_loader}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
