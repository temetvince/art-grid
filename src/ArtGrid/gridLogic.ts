import { GridSquare } from './types';
import { hashString, seededShuffle } from './utils';

// Initialize grid for the image
export const initializeGrid = (
  img: HTMLImageElement,
  gridRows: number,
  gridCols: number,
  imageSrc: string,
): {
  squares: GridSquare[];
  scale: number;
  displayDimensions: { width: number; height: number };
} => {
  console.log(
    'Initializing grid, image dimensions:',
    img.naturalWidth,
    img.naturalHeight,
  ); // Debug

  const maxWidth = 800; // Maximum width constraint
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const displayWidth = img.naturalWidth * scale;
  const displayHeight = img.naturalHeight * scale;

  // Calculate grid square dimensions (in original image coordinates)
  const squareWidth = img.naturalWidth / gridCols;
  const squareHeight = img.naturalHeight / gridRows;

  // Create grid squares
  const squares: GridSquare[] = [];
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      squares.push({
        row,
        col,
        x: col * squareWidth,
        y: row * squareHeight,
        width: squareWidth,
        height: squareHeight,
      });
    }
  }

  // Deterministic shuffle using image data hash
  const seed = hashString(imageSrc);
  const shuffled = seededShuffle(squares, seed);
  console.log('Grid squares created:', shuffled.length); // Debug
  return {
    squares: shuffled,
    scale,
    displayDimensions: { width: displayWidth, height: displayHeight },
  };
};

// Navigation handlers
export const goPrevious = (currentIndex: number): number => {
  return Math.max(0, currentIndex - 1);
};

export const goNext = (currentIndex: number, totalSquares: number): number => {
  return Math.min(totalSquares - 1, currentIndex + 1);
};

// Jump to a specific grid square
export const jumpToSquare = (
  jumpRow: string,
  jumpCol: string,
  gridRows: number,
  gridCols: number,
  gridSquares: GridSquare[],
  setCurrentIndex: (index: number) => void,
  setJumpRow: (row: string) => void,
  setJumpCol: (col: string) => void,
): void => {
  const row = parseInt(jumpRow, 10) - 1;
  const col = parseInt(jumpCol, 10) - 1;
  if (
    isNaN(row) ||
    isNaN(col) ||
    row < 0 ||
    row >= gridRows ||
    col < 0 ||
    col >= gridCols
  ) {
    alert('Invalid row or column');
    return;
  }
  const index = gridSquares.findIndex(
    (square) => square.row === row && square.col === col,
  );
  if (index !== -1) {
    setCurrentIndex(index);
    setJumpRow('');
    setJumpCol('');
  } else {
    alert('Square not found in sequence');
  }
};

export const makeGridSquare = (
  imageRef: React.RefObject<HTMLImageElement | null>,
  gridCols: number,
  setGridRows: (rows: number) => void,
): void => {
  if (!imageRef.current) return;

  const img = imageRef.current;
  const aspectRatio = img.naturalWidth / img.naturalHeight;

  // Keep the current number of columns and calculate rows to make squares
  const newRows = Math.round(gridCols / aspectRatio);
  setGridRows(newRows);
};
