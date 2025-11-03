import React from 'react';
import './Controls.css';

interface ControlsProps {
  gridRows: number;
  gridCols: number;
  onGridRowsChange: (rows: number) => void;
  onGridColsChange: (cols: number) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  makeSquares?: boolean;
  onMakeSquaresChange?: (checked: boolean) => void;
  upsideDown?: boolean;
  onUpsideDownChange?: (checked: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  gridRows,
  gridCols,
  onGridRowsChange,
  onGridColsChange,
  onImageUpload,
  makeSquares,
  onMakeSquaresChange,
  upsideDown,
  onUpsideDownChange,
}) => {
  return (
    <div className='controls'>
      <div className='input-group'>
        <label>Upload Image:</label>
        <input
          type='file'
          accept='image/*'
          onChange={onImageUpload}
        />
      </div>
      <div className='input-group'>
        <label>Grid Rows:</label>
        <input
          type='number'
          value={gridRows}
          onChange={(e) => {
            onGridRowsChange(Math.max(1, parseInt(e.target.value) || 1));
          }}
          min='1'
        />
      </div>
      <div className='input-group'>
        <label>Grid Columns:</label>
        <input
          type='number'
          value={gridCols}
          onChange={(e) => {
            onGridColsChange(Math.max(1, parseInt(e.target.value) || 1));
          }}
          min='1'
        />
      </div>
      {onMakeSquaresChange && (
        <div className='input-group'>
          <label>
            Make Squares Equal
            <input
              type='checkbox'
              checked={makeSquares || false}
              onChange={(e) => {
                onMakeSquaresChange(e.target.checked);
              }}
            />
          </label>
        </div>
      )}
      {onUpsideDownChange && (
        <div className='input-group'>
          <label>
            Upside Down
            <input
              type='checkbox'
              checked={upsideDown || false}
              onChange={(e) => {
                onUpsideDownChange(e.target.checked);
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default Controls;
