import React from 'react';
import './ImageDisplay.css';

interface GridSquare {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DisplayProps {
  imageSrc: string;
  gridSquares: GridSquare[];
  scale: number;
  displayDimensions: { width: number; height: number };
  imageRef: React.RefObject<HTMLImageElement | null>;
  upsideDown?: boolean;
}

const ImageDisplay: React.FC<DisplayProps> = ({
  imageSrc,
  gridSquares,
  scale,
  displayDimensions,
  imageRef,
  upsideDown = false,
}) => {
  return (
    <div className='image-container'>
      <div
        className='grid-overlay'
        style={{
          width: displayDimensions.width,
          height: displayDimensions.height,
        }}
      >
        {gridSquares.map((square, index) => (
          <div
            key={index}
            className='grid-square'
            style={{
              width: square.width * scale,
              height: square.height * scale,
              left: square.x * scale,
              top: square.y * scale,
            }}
          >
            <span>{`${String(square.row + 1)},${String(square.col + 1)}`}</span>
          </div>
        ))}
      </div>
      <img
        src={imageSrc}
        alt='Original'
        className='original-image'
        ref={imageRef}
        style={{
          maxWidth: '800px',
          width: displayDimensions.width,
          height: displayDimensions.height,
          transform: upsideDown ? 'rotate(180deg)' : 'none',
        }}
      />
    </div>
  );
};

export default ImageDisplay;
