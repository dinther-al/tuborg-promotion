// Import React and ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client';


// Import tailwind styles
import './css/tailwind.css';

import 'zmp-ui/zaui.css'; 

import './css/app.css';

import "personal-standard-ui-custom/dist/style.css";

// Import App Component
import MyApp from './routes';
import appConfig from '../app-config.json';

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount React App
const root = createRoot(document.getElementById('app')!);
root.render(React.createElement(MyApp));