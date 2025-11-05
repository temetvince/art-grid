import React, { useState, useEffect, useRef } from 'react';
import Controls from './Controls/Controls';
import ImageDisplay from './ImageDisplay/ImageDisplay';
import SquareViewer from './SquareViewer/SquareViewer';
import { GridSquare } from './types';
import {
  initializeGrid,
  goPrevious,
  goNext,
  jumpToSquare,
  makeGridSquare,
} from './gridLogic';
import { handleImageUpload, loadImage } from './imageUtils';
import './ArtGrid.css';

const ArtGrid: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [gridRows, setGridRows] = useState<number>(10);
  const [gridCols, setGridCols] = useState<number>(15);
  const [gridSquares, setGridSquares] = useState<GridSquare[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [jumpRow, setJumpRow] = useState<string>('');
  const [jumpCol, setJumpCol] = useState<string>('');
  const [makeSquares, setMakeSquares] = useState<boolean>(false);
  const [previousGridSettings, setPreviousGridSettings] = useState<{
    rows: number;
    cols: number;
  } | null>(null);
  const [upsideDown, setUpsideDown] = useState<boolean>(false);
  const [resizeTrigger, setResizeTrigger] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const scaleRef = useRef<number>(1);
  const displayDimensionsRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Handle image upload
  const handleImageUploadWrapper = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleImageUpload(event, setImageSrc);
  };

  // Initialize grid when image loads
  useEffect(() => {
    if (imageSrc) {
      loadImage(imageSrc)
        .then((img) => {
          const { squares, scale, displayDimensions } = initializeGrid(
            img,
            gridRows,
            gridCols,
            imageSrc,
          );
          scaleRef.current = scale;
          displayDimensionsRef.current = displayDimensions;
          setGridSquares(squares);
          setCurrentIndex(0);
        })
        .catch((error: unknown) => {
          console.error('Image load error', error);
          alert('Failed to load image');
        });
    }
  }, [imageSrc, gridRows, gridCols]);

  // Draw the current square upside down
  useEffect(() => {
    const currentSquare = gridSquares[currentIndex];
    if (canvasRef.current && imageSrc) {
      const img = imageRef.current;
      if (!img || !img.complete) return;

      // Calculate coordinates for drawing without mutating state
      let drawRow = currentSquare.row;
      let drawCol = currentSquare.col;
      if (upsideDown) {
        drawRow = gridRows - 1 - currentSquare.row;
        drawCol = gridCols - 1 - currentSquare.col;
      }
      const drawX = drawCol * currentSquare.width;
      const drawY = drawRow * currentSquare.height;
      console.log(
        'Drawing square:',
        currentSquare.row + 1,
        currentSquare.col + 1,
      ); // Debug
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not available');
        return;
      }

      // Set canvas size to original square dimensions for best resolution
      canvas.width = currentSquare.width;
      canvas.height = currentSquare.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        img,
        drawX,
        drawY,
        currentSquare.width,
        currentSquare.height,
        0,
        0,
        currentSquare.width,
        currentSquare.height,
      );
    } else {
      if (!canvasRef.current) {
        console.warn('Canvas ref is null'); // Debug
      }
    }
  }, [
    gridSquares,
    currentIndex,
    imageSrc,
    upsideDown,
    gridRows,
    gridCols,
    resizeTrigger,
  ]);

  // Trigger re-draw when image resizes
  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      const resizeObserver = new ResizeObserver(() => {
        setResizeTrigger((prev) => prev + 1);
      });
      resizeObserver.observe(img);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [imageSrc]);

  // Navigation handlers
  const goPreviousWrapper = () => {
    setCurrentIndex((prev) => goPrevious(prev));
  };

  const goNextWrapper = () => {
    setCurrentIndex((prev) => goNext(prev, gridSquares.length));
  };

  // Jump to a specific grid square
  const jumpToSquareWrapper = () => {
    jumpToSquare(
      jumpRow,
      jumpCol,
      gridRows,
      gridCols,
      gridSquares,
      setCurrentIndex,
      setJumpRow,
      setJumpCol,
    );
  };

  // Handle make squares checkbox change
  const handleMakeSquaresChange = (checked: boolean) => {
    if (checked) {
      // Store current settings before making squares
      setPreviousGridSettings({ rows: gridRows, cols: gridCols });
      // Make squares equal
      makeGridSquare(imageRef, gridCols, setGridRows);
    } else {
      // Restore previous settings
      if (previousGridSettings) {
        setGridRows(previousGridSettings.rows);
        setGridCols(previousGridSettings.cols);
      }
    }
    setMakeSquares(checked);
  };

  // Handle grid dimension changes - reset makeSquares when manually changed
  const handleGridRowsChange = (rows: number) => {
    setGridRows(rows);
    setMakeSquares(false);
    setPreviousGridSettings({ rows, cols: gridCols });
  };

  const handleGridColsChange = (cols: number) => {
    setGridCols(cols);
    setMakeSquares(false);
    setPreviousGridSettings({ rows: gridRows, cols });
  };

  return (
    <div className='container'>
      <h1 className='title'>Art Grid</h1>
      <Controls
        gridRows={gridRows}
        gridCols={gridCols}
        onGridRowsChange={handleGridRowsChange}
        onGridColsChange={handleGridColsChange}
        onImageUpload={handleImageUploadWrapper}
        makeSquares={makeSquares}
        onMakeSquaresChange={imageSrc ? handleMakeSquaresChange : undefined}
        upsideDown={upsideDown}
        onUpsideDownChange={imageSrc ? setUpsideDown : undefined}
        hasImage={!!imageSrc}
      />
      {imageSrc && gridSquares.length > 0 && (
        <div className='content'>
          <SquareViewer
            currentIndex={currentIndex}
            gridSquares={gridSquares}
            canvasRef={canvasRef}
            onPrevious={goPreviousWrapper}
            onNext={goNextWrapper}
            jumpRow={jumpRow}
            jumpCol={jumpCol}
            onJumpRowChange={setJumpRow}
            onJumpColChange={setJumpCol}
            onJumpToSquare={jumpToSquareWrapper}
          />
          <ImageDisplay
            imageSrc={imageSrc}
            gridSquares={gridSquares}
            imageRef={imageRef}
            upsideDown={upsideDown}
            currentIndex={currentIndex}
          />
        </div>
      )}
    </div>
  );
};

export default ArtGrid;
