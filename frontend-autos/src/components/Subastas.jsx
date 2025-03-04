import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subastaService } from '../services/api';

const Subastas = () => {
    const [subastas, setSubastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubasta, setSelectedSubasta] = useState(null);
    const [selectedAutoDetails, setSelectedAutoDetails] = useState(null);
    const [pujaAmount, setPujaAmount] = useState('');
    const [autosDetails, setAutosDetails] = useState({});
    const { hasRole } = useAuth();

    useEffect(() => {
        loadSubastas();
    }, []);

    const loadSubastas = async () => {
        try {
            const data = await subastaService.getActiveSubastas();
            console.log('Subastas cargadas:', data);
            setSubastas(data);
            
            // Cargar los detalles de todos los autos
            const autosDetailsMap = {};
            for (const subasta of data) {
                try {
                    const autoDetails = await subastaService.getAutoDetails(subasta.autoId);
                    autosDetailsMap[subasta.autoId] = autoDetails;
                } catch (err) {
                    console.error(`Error al cargar detalles del auto ${subasta.autoId}:`, err);
                }
            }
            setAutosDetails(autosDetailsMap);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar subastas:', err);
            setError('Error al cargar las subastas');
            setLoading(false);
        }
    };

    const handleSelectSubasta = async (subasta) => {
        try {
            const autoDetails = await subastaService.getAutoDetails(subasta.autoId);
            setSelectedAutoDetails(autoDetails);
            setSelectedSubasta(subasta);
        } catch (err) {
            console.error('Error al cargar detalles del auto:', err);
            setError('Error al cargar los detalles del vehículo');
        }
    };

    const handlePuja = async (e) => {
        e.preventDefault();
        if (!selectedSubasta || !pujaAmount) return;

        try {
            const monto = parseFloat(pujaAmount);
            if (isNaN(monto) || monto <= 0) {
                setError('El monto de la puja debe ser un número positivo');
                return;
            }

            if (monto < selectedSubasta.precioMinimo) {
                setError(`El monto debe ser mayor o igual a $${selectedSubasta.precioMinimo}`);
                return;
            }

            await subastaService.realizarPuja(
                selectedSubasta.autoId,
                monto
            );

            await loadSubastas();
            setSelectedSubasta(null);
            setSelectedAutoDetails(null);
            setPujaAmount('');
            setError('');
        } catch (err) {
            console.error('Error al realizar puja:', err);
            setError(err.message || 'Error al realizar la puja');
        }
    };

    const closeModal = () => {
        setSelectedSubasta(null);
        setSelectedAutoDetails(null);
        setPujaAmount('');
        setError('');
    };

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
                        key={subasta.autoId}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Subasta #{subasta.autoId}</h3>
                            
                            {/* Información del Vehículo */}
                            {autosDetails[subasta.autoId] && (
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <h4 className="font-semibold text-gray-700 mb-2">Información del Vehículo</h4>
                                    <p><span className="font-medium">Marca:</span> {autosDetails[subasta.autoId].marca}</p>
                                    <p><span className="font-medium">Modelo:</span> {autosDetails[subasta.autoId].modelo}</p>
                                    <p><span className="font-medium">Año:</span> {autosDetails[subasta.autoId].anio}</p>
                                    <p><span className="font-medium">Precio Base:</span> ${autosDetails[subasta.autoId].precio_base}</p>
                                </div>
                            )}

                            {/* Información de la Subasta */}
                            <div className="text-gray-600 mb-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Detalles de la Subasta</h4>
                                <p>Precio Mínimo: ${subasta.precioMinimo}</p>
                                <p>Fecha Inicio: {new Date(subasta.fechaInicio).toLocaleDateString()}</p>
                                <p>Fecha Fin: {new Date(subasta.fechaFin).toLocaleDateString()}</p>
                                <p>Estado: {subasta.activa ? 'Activa' : 'Inactiva'}</p>
                                {subasta.ganadorId && <p>Ganador ID: {subasta.ganadorId}</p>}
                            </div>

                            {hasRole('ROLE_COMPRADOR') && (
                                <button
                                    onClick={() => handleSelectSubasta(subasta)}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                                >
                                    Realizar Puja
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para realizar puja con detalles del auto */}
            {selectedSubasta && selectedAutoDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            Detalles del Vehículo en Subasta
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <h4 className="font-semibold text-gray-700">Información del Vehículo</h4>
                                <p><span className="font-medium">Marca:</span> {selectedAutoDetails.marca}</p>
                                <p><span className="font-medium">Modelo:</span> {selectedAutoDetails.modelo}</p>
                                <p><span className="font-medium">Año:</span> {selectedAutoDetails.anio}</p>
                                <p><span className="font-medium">Precio Base:</span> ${selectedAutoDetails.precio_base}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Detalles de la Subasta</h4>
                                <p><span className="font-medium">Precio Mínimo:</span> ${selectedSubasta.precioMinimo}</p>
                                <p><span className="font-medium">Fecha Inicio:</span> {new Date(selectedSubasta.fechaInicio).toLocaleDateString()}</p>
                                <p><span className="font-medium">Fecha Fin:</span> {new Date(selectedSubasta.fechaFin).toLocaleDateString()}</p>
                                <p><span className="font-medium">Estado:</span> {selectedSubasta.activa ? 'Activa' : 'Inactiva'}</p>
                            </div>
                        </div>

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
                                    onClick={closeModal}
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