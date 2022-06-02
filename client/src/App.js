import React from 'react';
import SliderCaptcha from '@slider-captcha/react';

import './App.css';

function verifiedCallback(token) {
  console.log('Captcha token: ' + token);
}

function App() {
  return (
    <div className="App">
      <SliderCaptcha
        create="http://localhost:3010/captcha/create"
        verify="http://localhost:3010/captcha/verify"
        callback={verifiedCallback}
      />
    </div>
  );
}

export default App;
