import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subastaService } from '../services/api';
import { Navigate } from 'react-router-dom';

const Subastas = () => {
    const [subastas, setSubastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubasta, setSelectedSubasta] = useState(null);
    const [pujaAmount, setPujaAmount] = useState('');
    const { hasRole } = useAuth();

    useEffect(() => {
        if (hasRole('ROLE_COMPRADOR')) {
            loadSubastas();
        }
    }, [hasRole]);

    const loadSubastas = async () => {
        try {
            const data = await subastaService.getActiveSubastas();
            console.log('Subastas cargadas:', data);
            setSubastas(data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar subastas:', err);
            setError('Error al cargar las subastas');
            setLoading(false);
        }
    };

    const handlePuja = async (e) => {
        e.preventDefault();
        if (!selectedSubasta || !pujaAmount) return;

        try {
            // Convertir el monto a número y validar
            const monto = parseFloat(pujaAmount);
            if (isNaN(monto) || monto <= 0) {
                setError('El monto de la puja debe ser un número positivo');
                return;
            }

            // Asegurarse de que el monto sea mayor o igual al precio mínimo
            if (monto < selectedSubasta.precioMinimo) {
                setError(`El monto debe ser mayor o igual a $${selectedSubasta.precioMinimo}`);
                return;
            }

            await subastaService.realizarPuja(
                selectedSubasta.id, // Usando autoId como subastaId
                monto
            );

            // Reload subastas to get updated data
            await loadSubastas();
            setSelectedSubasta(null);
            setPujaAmount('');
            setError(''); // Limpiar cualquier error previo
        } catch (err) {
            console.error('Error al realizar puja:', err);
            setError(err.message || 'Error al realizar la puja');
        }
    };

    // Redirigir si no es un comprador
    if (!hasRole('ROLE_COMPRADOR')) {
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
            <h2 className="text-2xl font-bold mb-6">Subastas Activas</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subastas.map((subasta) => (
                    <div
                        key={subasta.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Auto ID: {subasta.autoId}</h3>
                            <h3 className="text-xl font-semibold mb-2">Subasta ID: {subasta.id}</h3>
                            <div className="text-gray-600 mb-4">
                                <p>Precio Mínimo: ${subasta.precioMinimo}</p>
                                <p>Fecha Inicio: {new Date(subasta.fechaInicio).toLocaleDateString()}</p>
                                <p>Fecha Fin: {new Date(subasta.fechaFin).toLocaleDateString()}</p>
                                <p>Estado: {subasta.activa ? 'Activa' : 'Inactiva'}</p>
                                {subasta.ganadorId && <p>Ganador ID: {subasta.ganadorId}</p>}
                            </div>

                            <button
                                onClick={() => setSelectedSubasta(subasta)}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                            >
                                Realizar Puja
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para realizar puja */}
            {selectedSubasta && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            Realizar Puja - Subasta ID: {selectedSubasta.id}
                        </h3>
                        <form onSubmit={handlePuja}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Monto de la Puja
                                </label>
                                <input
                                    type="number"
                                    value={pujaAmount}
                                    onChange={(e) => setPujaAmount(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    min={selectedSubasta.precioMinimo}
                                    step="0.01"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    El monto debe ser mayor o igual a ${selectedSubasta.precioMinimo}
                                </p>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedSubasta(selectedSubasta.id);
                                        setPujaAmount('');
                                        setError(''); // Limpiar cualquier error al cerrar el modal
                                    }}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                                >
                                    Confirmar Puja
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subastas; 