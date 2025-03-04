import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, roles, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const getUserEmail = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.sub || 'No email';
            } catch (error) {
                console.error('Error getting email from token:', error);
                return 'Error';
            }
        }
        return '';
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-white font-bold text-xl">
                                Subastas Auto
                            </Link>
                        </div>
                        {user && (
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    {hasRole('ROLE_VENDEDOR') && (
                                        <>
                                            <Link
                                                to="/mis-vehiculos"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Mis Vehículos
                                            </Link>
                                            <Link
                                                to="/subastas"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Mis Subastas Activas
                                            </Link>
                                        </>
                                    )}
                                    {(hasRole('ROLE_COMPRADOR')) && (
                                        <Link
                                            to="/subastasActivas"
                                            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Subastas Activas
                                        </Link>
                                    )}
                                    {hasRole('ROLE_ADMINISTRADOR') && (
                                        <>
                                            <Link
                                                to="/usuarios"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Usuarios
                                            </Link>
                                            <Link
                                                to="/vehiculos"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Vehículos
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    {/* <div className="text-gray-300 text-sm">
                                        Roles: {roles.join(', ')}
                                    </div> */}
                                    <div className="text-gray-300 text-sm">
                                        <div>
                                            Email: {getUserEmail()}
                                        </div>
                                        <span>Roles: {roles.join(', ')}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-black-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 