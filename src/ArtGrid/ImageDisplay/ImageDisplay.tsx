import React, { useState, useEffect } from 'react';
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
  imageRef: React.RefObject<HTMLImageElement | null>;
  upsideDown?: boolean;
}

const ImageDisplay: React.FC<DisplayProps> = ({
  imageSrc,
  gridSquares,
  imageRef,
  upsideDown = false,
}) => {
  const [imageScale, setImageScale] = useState(1);
  const [overlayWidth, setOverlayWidth] = useState(0);
  const [overlayHeight, setOverlayHeight] = useState(0);

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const handleLoad = () => {
        const actualScale = img.clientWidth / img.naturalWidth;
        setImageScale(actualScale);
        setOverlayWidth(img.clientWidth);
        setOverlayHeight(img.clientHeight);
      };
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad);
      }

      // Use ResizeObserver to detect when the image resizes
      const resizeObserver = new ResizeObserver(() => {
        if (img.complete) {
          handleLoad();
        }
      });
      resizeObserver.observe(img);

      return () => {
        img.removeEventListener('load', handleLoad);
        resizeObserver.disconnect();
      };
    }
  }, [imageSrc]);

  return (
    <div className='image-container'>
      <div
        className='grid-overlay'
        style={{
          width: overlayWidth,
          height: overlayHeight,
        }}
      >
        {gridSquares.map((square, index) => (
          <div
            key={index}
            className='grid-square'
            style={{
              width: square.width * imageScale,
              height: square.height * imageScale,
              left: square.x * imageScale,
              top: square.y * imageScale,
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
          maxWidth: '100%',
          height: 'auto',
          transform: upsideDown ? 'rotate(180deg)' : 'none',
        }}
      />
    </div>
  );
};

export default ImageDisplay;
