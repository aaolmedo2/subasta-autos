import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Subastas from './components/Subastas';
import MisVehiculos from './components/MisVehiculos';
import Usuarios from './components/Usuarios';
import Vehiculos from './components/Vehiculos';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, hasAnyRole } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="py-10">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/subastas"
                  element={
                    <PrivateRoute allowedRoles={['ROLE_COMPRADOR', 'ROLE_VENDEDOR']}>
                      <Subastas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mis-vehiculos"
                  element={
                    <PrivateRoute allowedRoles={['ROLE_VENDEDOR']}>
                      <MisVehiculos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute allowedRoles={['ROLE_ADMINISTRADOR']}>
                      <Usuarios />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/vehiculos"
                  element={
                    <PrivateRoute allowedRoles={['ROLE_ADMINISTRADOR']}>
                      <Vehiculos />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
