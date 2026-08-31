
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import ScrollToTop from './components/ScrollToTop.tsx'


/*
const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
})
*/



createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
   <ScrollToTop/>
      <App />
    </BrowserRouter>

)