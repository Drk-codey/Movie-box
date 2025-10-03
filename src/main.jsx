import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// import store from './store/slices/authSlide.js'
import './index.css'
import App from './App.jsx'
import { store, persistor } from './store/index.js'

// Loading component for PersistGate
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900">
    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-red-500'></div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
