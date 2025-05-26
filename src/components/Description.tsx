import React from 'react';
import '../styles/Description.css';

interface DescriptionProps {
  children: React.ReactNode;
}

const Description: React.FC<DescriptionProps> = ({ children }) => {
  return (
    <div className='container'>
      <div className='description'>{children}</div>
    </div>
  );
};

export default Description;
