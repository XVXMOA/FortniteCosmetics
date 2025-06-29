import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Always allow scroll/pull-to-refresh on mobile
if (typeof document !== 'undefined') {
  document.body.style.overflow = 'unset';
}

createRoot(document.getElementById("root")!).render(<App />);
