// Mark the active entry bundle so stale browser assets can be diagnosed.
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

document.documentElement.dataset.rtsBundleVersion = '2026-11-19-recovery-2';

createRoot(document.getElementById('root')!).render(<App />);
