import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, roles, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

    const formatDate = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const monthName = months[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);

        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');

        return `${dayName} ${day}-${monthName}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    };

    // Mapping of role codes to readable names
    const roleMap = {
        'ROLE_COMPRADOR': 'Comprador',
        'ROLE_VENDEDOR': 'Vendedor',
        'ROLE_ADMINISTRADOR': 'Administrador'
    };

    // Convert role codes to readable names
    const readableRoles = roles
        .map(role => roleMap[role] || role)
        .filter(Boolean); // Remove any undefined roles

    // Format the roles nicely
    const formatRoles = () => {
        if (readableRoles.length === 0) return 'Sin roles';
        if (readableRoles.length === 1) return readableRoles[0];

        // For multiple roles
        const lastRole = readableRoles.pop();
        return `${readableRoles.join(', ')} y ${lastRole}`;
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
                            <div className="text-sm font-mono text-white">
                                {formatDate(currentDateTime)}
                            </div>
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
                                        <>
                                            <Link
                                                to="/mis-vehiculosComprador"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Mis Vehículos
                                            </Link>
                                            <Link
                                                to="/subastasActivas"
                                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                            >
                                                Subastas Activas
                                            </Link>
                                        </>
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

                                    <div className="text-gray-300 text-sm">
                                        <div>
                                            <b>Email:</b> {getUserEmail()}
                                        </div>
                                        {/* <span>Roles: {roles.join(', ')}</span> */}
                                        <span><b>Roles:</b> {formatRoles()}</span>
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
        </nav >
    );
};

export default Navbar; 