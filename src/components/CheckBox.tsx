import React from 'react';

import '../styles/CheckBox.css';

interface CheckBoxProps {
  name: string;
  value: string;
  children: React.ReactNode;
}

const CheckBox: React.FC<CheckBoxProps> = ({ name, value, children }) => {
  return (
    <div className='component'>
      <div className='check'>
        <input
          type='checkbox'
          name={name}
          value={value}
        />
        <label className='text'>{children}</label>
      </div>
    </div>
  );
};

export default CheckBox;
