import React from 'react';
import './SquareViewer.css';

interface GridSquare {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SquareViewerProps {
  currentIndex: number;
  gridSquares: GridSquare[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onPrevious: () => void;
  onNext: () => void;
  jumpRow: string;
  jumpCol: string;
  onJumpRowChange: (value: string) => void;
  onJumpColChange: (value: string) => void;
  onJumpToSquare: () => void;
}

const SquareViewer: React.FC<SquareViewerProps> = ({
  currentIndex,
  gridSquares,
  canvasRef,
  onPrevious,
  onNext,
  jumpRow,
  jumpCol,
  onJumpRowChange,
  onJumpColChange,
  onJumpToSquare,
}) => {
  return (
    <div className='current-square-container'>
      <h2>
        Current Square:{' '}
        {`${String(gridSquares[currentIndex].row + 1)},${String(
          gridSquares[currentIndex].col + 1,
        )}`}{' '}
        (Index: {String(currentIndex + 1)}/{String(gridSquares.length)})
      </h2>
      <canvas
        ref={canvasRef}
        className='current-square'
      />
      <div className='navigation'>
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === gridSquares.length - 1}
        >
          Next
        </button>
      </div>
      <div className='jump-controls'>
        <label>Jump to Square:</label>
        <input
          type='number'
          placeholder='Row'
          value={jumpRow}
          onChange={(e) => {
            onJumpRowChange(e.target.value);
          }}
          min='1'
        />
        <input
          type='number'
          placeholder='Column'
          value={jumpCol}
          onChange={(e) => {
            onJumpColChange(e.target.value);
          }}
          min='1'
        />
        <button onClick={onJumpToSquare}>Jump</button>
      </div>
    </div>
  );
};

export default SquareViewer;
