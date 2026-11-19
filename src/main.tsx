// Force a fresh production entry bundle after the stale mobile asset reference.
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
