import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './redux/auth/operations';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import PrivateRoutes from './routes/PrivateRoutes';
import RestrictedRoutes from './routes/RestrictedRoutes';
import { getTransactions } from "./redux/transactions/operations";
import DashboardPage from './pages/DashboardPage/DashboardPage';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage';
import CurrencyPage from './pages/CurrencyPage/CurrencyPage';

import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      // ⿡ Sayfa yüklendiğinde kullanıcı oturumunu kontrol et
      await dispatch(checkAuthStatus()).unwrap();

      // ⿢ Token store'a geldiği için artık transactions çekilebilir
      dispatch(getTransactions());
    };
    init();
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
          <Route path="/dashboard" element={
            <PrivateRoutes>
              <DashboardPage />
            </PrivateRoutes>
          } />
          <Route path="/home" element={ 
            <PrivateRoutes> 
              <DashboardPage /> 
            </PrivateRoutes> 
          } />
          <Route path="/statistics" element={
            <PrivateRoutes>
              <StatisticsPage />
            </PrivateRoutes>
          } />
          <Route path="/currency" element={
            <PrivateRoutes>
              <CurrencyPage />
            </PrivateRoutes>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
