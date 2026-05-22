import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardStudent from './pages/DashboardStudent';
import DashboardResponsable from './pages/DashboardResponsable';
import DashboardAdmin from './pages/DashboardAdmin';
import './styles/global.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard/student"
            element={
              <PrivateRoute allowedRoles={['ETUDIANT', 'RESPONSABLE', 'ADMIN']}>
                <DashboardStudent />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/responsable"
            element={
              <PrivateRoute allowedRoles={['RESPONSABLE', 'ADMIN']}>
                <DashboardResponsable />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
