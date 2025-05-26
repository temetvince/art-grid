import React from 'react';
import '../styles/Container.css';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className='container'>
      <div className='component'>{children}</div>
    </div>
  );
};

export default Container;
