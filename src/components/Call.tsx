import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Call: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/')
      .then((response) => {
        setMessage(response.data as string);
      })
      .catch((error: unknown) => {
        console.error('There was an error making the request!', error);
      });
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <p>{message}</p>
      </header>
    </div>
  );
};

export default Call;
