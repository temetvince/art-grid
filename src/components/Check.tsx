import React from 'react';
import '../styles/Check.css';

interface CheckProps {
  isChecked: boolean;
  children: React.ReactNode;
}

const Check: React.FC<CheckProps> = ({ isChecked, children }) => {
  return (
    <div className='component'>
      <div className='check'>
        {isChecked ?
          <i className='pi pi-check' />
        : <i className='pi pi-times' />}
        <div className='text'>{children}</div>
      </div>
    </div>
  );
};

export default Check;
