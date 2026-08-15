import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { startWebVitalsMonitoring } from './utils/webVitals'

createRoot(document.getElementById("root")!).render(<App />);
startWebVitalsMonitoring();
