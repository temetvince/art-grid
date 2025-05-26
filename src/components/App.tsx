import React, { useEffect, useState } from 'react';
import swm2 from '../../public/images/LoadScrHD_SWM2.png';
import Image from './Image';
import Navigator from './Navigator';
import Description from './Description';
import Settings from './Settings';
import Check from './Check';
import CheckBox from './CheckBox';
import 'primeicons/primeicons.css';
import '../styles/App.css';
import content from '../../public/content.json';

const App = () => {
  const [appContent, setAppContent] = useState({
    title: '',
    installHeader: '',
    installSteam: '',
    installNoSteam: '',
    installButton: '',
    installOptional: '',
    alaankwa: '',
    altFont: '',
    swm2Alt: '',
    featuresHeader: '',
    features: [] as { title: string; details: string[] }[],
    description: '',
  });

  useEffect(() => {
    setAppContent(content);
  }, []);

  return (
    <div className='app-container'>
      <header className='container-column container-alt'>
        <Navigator>
          <h1>{appContent.title}</h1>
        </Navigator>
      </header>

      <main className='container-row'>
        <section className='container-alt settings'>
          <div>
            <Image
              source={swm2 as string}
              alt={appContent.swm2Alt}
            />
          </div>
          <Settings>
            <div className='component'>
              <h2>{appContent.installHeader}</h2>
              <Check isChecked={true}>
                <p>{appContent.installSteam}</p>
              </Check>
              <Check isChecked={false}>
                <p>{appContent.installNoSteam}</p>
              </Check>
              <p>{appContent.installOptional}</p>
              <CheckBox
                name='alaankwa'
                value='Alaankwa'
              >
                <p>{appContent.alaankwa}</p>
              </CheckBox>
              <CheckBox
                name='alternateFont'
                value='Alternate Font'
              >
                <p>{appContent.altFont}</p>
              </CheckBox>
              <button className='install-button'>
                {appContent.installButton}
              </button>
            </div>
          </Settings>
        </section>

        <section className='container-alt description'>
          <Description>
            <h2>{appContent.featuresHeader}</h2>
            <p>
              <strong>{appContent.title}</strong> {appContent.description}
            </p>
            {appContent.features.map((feature, index) => (
              <div key={index}>
                <h3>{feature.title}</h3>
                <ul>
                  {feature.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Description>
        </section>
      </main>
    </div>
  );
};

export default App;
