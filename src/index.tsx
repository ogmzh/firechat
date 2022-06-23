import { initializeApp } from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Providers';
import reportWebVitals from './reportWebVitals';

initializeApp(
  {
    apiKey: 'AIzaSyDwb7IP9BekGFq3A23aRQq6lFrHorPkrcc',
    authDomain: 'firechat-27e8e.firebaseapp.com',
    projectId: 'firechat-27e8e',
    storageBucket: 'firechat-27e8e.appspot.com',
    messagingSenderId: '1040635482321',
    appId: '1:1040635482321:web:282ca93617f44a5b1735f0',
    measurementId: 'G-XLJCPR3J2X',
  },
  'firechat'
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
