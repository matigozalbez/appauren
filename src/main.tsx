
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import ScrollToTop from './components/ScrollToTop.tsx'
import { useEffect } from 'react'

/*
const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
})
*/

        useEffect(() => {
  const bloquearEdgeSwipe = (e: TouchEvent) => {
    const touchX = e.touches[0].clientX;
    if (touchX < 20) { // margen del borde izquierdo, ajustable
      e.preventDefault();
    }
  };
  document.addEventListener("touchstart", bloquearEdgeSwipe, { passive: false });
  return () => document.removeEventListener("touchstart", bloquearEdgeSwipe);
}, []);

createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
   <ScrollToTop/>
      <App />
    </BrowserRouter>

)