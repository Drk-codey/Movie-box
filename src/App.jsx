import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

// Components
import ProtectedRoute from "./Components/ProtectedRoute";
import LoadingSpinner from "./Components/LoadingSpinner";

// Pages
import Home from './Pages/Home';
import Movies from "./Pages/Movies";
import Signin from "./Pages/Signin";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/Profile";
import MovieDetail from "./Pages/MovieDetail";
import NotFound from './Pages/NotFound';
import Upcoming from "./Pages/Upcoming";
import Favorite from "./Pages/Favorite";


function AppContent() {
  return (
    <div className="App">
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/upcoming" element={<Upcoming />} />

      {/* Auth routes - redirect to home if already authenticated */}
      <Route 
        path="/signin"
        element={
          <ProtectedRoute requireAuth={false}>
            <Signin />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/signup"
        element={
          <ProtectedRoute requireAuth={false}>
            <SignUp />
          </ProtectedRoute>
        }
      />

      {/* Protected routes - require authentication */}
      <Route 
        path="/profile"
        element={
          <ProtectedRoute requireAuth={true}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/favorites"
        element={
          <ProtectedRoute requireAuth={true}>
            <Favorite />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path='*' element={<NotFound />} />
    </Routes>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor} >
        <AppContent />
      </PersistGate>
    </Provider>
  )
}

export default App;
