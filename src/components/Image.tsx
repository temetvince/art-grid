import React from 'react';
import '../styles/Image.css';

interface ImageProps {
  source: string;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ source, alt }) => {
  return (
    <div className='container'>
      <img
        className='loadscreen'
        src={source}
        alt={alt}
      />
    </div>
  );
};

export default Image;
