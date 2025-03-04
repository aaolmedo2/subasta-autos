import React, { useState, useEffect } from 'react';
import { subastaService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const MisSubastas = () => {
    const [subastas, setSubastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { hasRole } = useAuth();

    useEffect(() => {
        const checkRoleAndLoadSubastas = async () => {
            try {
                // Verificar el token y los roles
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('Token payload en MisSubastas:', payload);
                    console.log('Roles del usuario en MisSubastas:', payload.authority);
                }

                const isVendedor = hasRole('ROLE_VENDEDOR');
                console.log('¿Es vendedor?:', isVendedor);

                if (isVendedor) {
                    const vendedorId = authService.getCurrentUserId();
                    console.log('ID del vendedor:', vendedorId);

                    if (!vendedorId) {
                        throw new Error('No se pudo obtener el ID del vendedor');
                    }

                    console.log('Obteniendo subastas para vendedor ID:', vendedorId);
                    const data = await subastaService.getActiveSubastasByVendedor(vendedorId);
                    console.log('Subastas recibidas:', data);

                    if (Array.isArray(data)) {
                        setSubastas(data);
                    } else {
                        console.error('Los datos recibidos no son un array:', data);
                        setSubastas([]);
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error completo:', err);
                setError(err.message || 'Error al cargar las subastas');
                setLoading(false);
            }
        };

        checkRoleAndLoadSubastas();
    }, [hasRole]);

    // Redirigir si no es un vendedor
    if (!hasRole('ROLE_VENDEDOR')) {
        console.log('Usuario no es vendedor, redirigiendo...');
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Cargando subastas...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Mis Subastas Activas</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {subastas.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                    No tienes subastas activas en este momento
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subastas.map((subasta) => (
                        <div
                            key={subasta.autoId}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">Auto ID: {subasta.autoId}</h3>
                                <div className="text-gray-600 mb-4">
                                    <p>Precio Mínimo: ${subasta.precioMinimo}</p>
                                    <p>Fecha Inicio: {new Date(subasta.fechaInicio).toLocaleDateString()}</p>
                                    <p>Fecha Fin: {new Date(subasta.fechaFin).toLocaleDateString()}</p>
                                    <p>Estado: {subasta.activa ? 'Activa' : 'Inactiva'}</p>
                                    {subasta.ganadorId && <p>Ganador ID: {subasta.ganadorId}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisSubastas; 