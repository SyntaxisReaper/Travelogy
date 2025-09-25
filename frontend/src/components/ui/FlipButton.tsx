import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

export interface FlipButtonProps extends ButtonProps {
  front: React.ReactNode;
  back?: React.ReactNode;
  flipAxis?: 'X' | 'Y';
  flipOn?: 'hover' | 'click';
}

const FlipButton: React.FC<FlipButtonProps> = ({ front, back, flipAxis = 'Y', flipOn = 'hover', children, ...btnProps }) => {
  const axis = flipAxis.toUpperCase() === 'X' ? 'X' : 'Y';
  const mode = flipOn === 'click' ? 'click' : 'hover';
  return (
    <Button {...btnProps} className={`flip-btn ${btnProps.className || ''}`.trim()} data-axis={axis} data-flip={mode}>
      <span className="flip-inner">
        <span className="flip-front">{front ?? children}</span>
        <span className="flip-back">{back ?? front ?? children}</span>
      </span>
    </Button>
  );
};

export default FlipButton;
