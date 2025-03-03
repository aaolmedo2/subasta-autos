import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { role } = useAuth();
    const navigate = useNavigate();

    const renderDashboardContent = () => {
        switch (role) {
            case 'ROLE_COMPRADOR':
                return (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Panel de Comprador</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => navigate('/subastas')}
                                className="bg-indigo-50 p-6 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                            >
                                <h3 className="text-lg font-semibold mb-2">Subastas Activas</h3>
                                <p className="text-gray-600">
                                    Ver todas las subastas disponibles y realizar pujas
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'ROLE_VENDEDOR':
                return (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Panel de Vendedor</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => navigate('/mis-vehiculos')}
                                className="bg-indigo-50 p-6 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                            >
                                <h3 className="text-lg font-semibold mb-2">Mis Vehículos</h3>
                                <p className="text-gray-600">
                                    Gestionar tus vehículos y crear nuevas subastas
                                </p>
                            </div>
                            <div
                                onClick={() => navigate('/subastas')}
                                className="bg-indigo-50 p-6 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                            >
                                <h3 className="text-lg font-semibold mb-2">Subastas Activas</h3>
                                <p className="text-gray-600">
                                    Ver todas las subastas disponibles
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'ROLE_ADMINISTRADOR':
                return (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => navigate('/usuarios')}
                                className="bg-indigo-50 p-6 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                            >
                                <h3 className="text-lg font-semibold mb-2">Gestión de Usuarios</h3>
                                <p className="text-gray-600">
                                    Administrar usuarios del sistema
                                </p>
                            </div>
                            <div
                                onClick={() => navigate('/vehiculos')}
                                className="bg-indigo-50 p-6 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                            >
                                <h3 className="text-lg font-semibold mb-2">Gestión de Vehículos</h3>
                                <p className="text-gray-600">
                                    Administrar todos los vehículos registrados
                                </p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Bienvenido</h2>
                        <p className="text-gray-600">
                            Por favor, contacta al administrador si no tienes acceso a ninguna función.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                {renderDashboardContent()}
            </div>
        </div>
    );
};

export default Dashboard; 