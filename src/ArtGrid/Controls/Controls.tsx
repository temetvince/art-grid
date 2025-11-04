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
  hasImage?: boolean;
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
  hasImage = false,
}) => {
  return (
    <div className='controls'>
      <div className='input-section'>
        <div className='input-group'>
          <label>Upload Image</label>
          <input
            type='file'
            accept='image/*'
            onChange={onImageUpload}
          />
        </div>
      </div>
      {hasImage && (
        <div className='input-section-grid'>
          <div className='input-group'>
            <label>Grid Rows</label>
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
            <label>Grid Columns</label>
            <input
              type='number'
              value={gridCols}
              onChange={(e) => {
                onGridColsChange(Math.max(1, parseInt(e.target.value) || 1));
              }}
              min='1'
            />
          </div>
        </div>
      )}
      <div className='input-section'>
        {onMakeSquaresChange && (
          <div className='input-group'>
            <label>Square Grid</label>
            <input
              type='checkbox'
              checked={makeSquares || false}
              onChange={(e) => {
                onMakeSquaresChange(e.target.checked);
              }}
            />
          </div>
        )}
        {onUpsideDownChange && (
          <div className='input-group'>
            <label>Upside Down</label>
            <input
              type='checkbox'
              checked={upsideDown || false}
              onChange={(e) => {
                onUpsideDownChange(e.target.checked);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;
