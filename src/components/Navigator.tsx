import React from 'react';
import '../styles/Navigator.css';

interface NavigatorProps {
  children: React.ReactNode;
}

const Navigator: React.FC<NavigatorProps> = ({ children }) => {
  return (
    <div className='container'>
      <i className='pi pi-chevron-left' />
      <div className='navigator'>{children}</div>
      <i className='pi pi-chevron-right' />
    </div>
  );
};

export default Navigator;
