import React from 'react';
import '../styles/Settings.css';

interface SettingsProps {
  children: React.ReactNode;
}

const Settings: React.FC<SettingsProps> = ({ children }) => {
  return (
    <div className='component'>
      <div className='settings'>{children}</div>
    </div>
  );
};

export default Settings;
