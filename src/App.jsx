import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './redux/auth/operations';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import MainPage from './pages/MainPage/MainPage';
import PrivateRoutes from './routes/PrivateRoutes';
import RestrictedRoutes from './routes/RestrictedRoutes';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı oturumunu kontrol et
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            <RestrictedRoutes>
              <LoginPage />
            </RestrictedRoutes>
          } />
          <Route path="/register" element={
            <RestrictedRoutes>
              <RegisterPage />
            </RestrictedRoutes>
          } />
          <Route path="/main" element={
            <PrivateRoutes>
              <MainPage />
            </PrivateRoutes>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
