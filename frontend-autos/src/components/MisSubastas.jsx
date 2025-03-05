import React, { useState, useEffect } from 'react';
import { subastaService, authService, vehicleService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const MisSubastas = () => {
    const [subastas, setSubastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { hasRole } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({
        autoId: '',
        fechaInicio: '',
        fechaFin: '',
        precioMinimo: ''
    });

    // Cargar vehículos y subastas del vendedor
    useEffect(() => {
        const loadData = async () => {
            try {
                const vendedorId = authService.getCurrentUserId();
                if (!vendedorId) {
                    throw new Error('No se pudo obtener el ID del vendedor');
                }

                // Cargar vehículos del vendedor
                const vehiclesData = await vehicleService.getVehiclesByVendedor(vendedorId);

                // Cargar subastas activas
                const subastasData = await subastaService.getActiveSubastasByVendedor(vendedorId);
                const subastasActivas = Array.isArray(subastasData) ? subastasData : [];
                setSubastas(subastasActivas);

                // Filtrar vehículos que no están en subasta activa
                const autosEnSubasta = subastasActivas.map(subasta => subasta.autoId);
                const availableVehicles = vehiclesData.filter(vehicle =>
                    !vehicle.estado && !autosEnSubasta.includes(vehicle.id)
                );

                if (vehiclesData.length > 0 && availableVehicles.length === 0) {
                    toast.info('Todos tus vehículos disponibles ya están en subasta');
                }

                setVehicles(availableVehicles);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                toast.error(err.message || 'Error al cargar los datos');
                setLoading(false);
            }
        };

        if (hasRole('ROLE_VENDEDOR')) {
            loadData();
        }
    }, [hasRole]);

    const handleVehicleSelect = (e) => {
        const vehicleId = e.target.value;
        const vehicle = vehicles.find(v => v.id === parseInt(vehicleId));
        setSelectedVehicle(vehicle);

        if (vehicle) {
            setFormData(prev => ({
                ...prev,
                autoId: vehicle.id,
                precioMinimo: vehicle.precio_base
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateDates = () => {
        const fechaInicio = new Date(formData.fechaInicio);
        const fechaFin = new Date(formData.fechaFin);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (fechaInicio < today) {
            setError('La fecha de inicio no puede ser anterior a hoy');
            return false;
        }

        if (fechaFin <= fechaInicio) {
            setError('La fecha de fin debe ser posterior a la fecha de inicio');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateDates()) {
            return;
        }

        try {
            const subastaData = {
                ...formData,
                autoId: parseInt(formData.autoId),
                precioMinimo: parseFloat(formData.precioMinimo)
            };

            await subastaService.crearSubasta(subastaData);

            // Recargar subastas
            const vendedorId = authService.getCurrentUserId();
            const subastasActualizadas = await subastaService.getActiveSubastasByVendedor(vendedorId);
            setSubastas(Array.isArray(subastasActualizadas) ? subastasActualizadas : []);

            // Limpiar formulario
            setFormData({
                autoId: '',
                fechaInicio: '',
                fechaFin: '',
                precioMinimo: ''
            });
            setSelectedVehicle(null);

            
        } catch (err) {
            console.error('Error al crear la subasta:', err);
            setError(err.message || 'Error al crear la subasta');
        }
    };

    if (!hasRole('ROLE_VENDEDOR')) {
        return <Navigate to="/" replace />;
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta subasta?')) {
            try {
                await subastaService.deleteSubasta(id);
                toast.success('Subasta eliminada con éxito!');
                // Refrescar subastas filtrando la lista actual
                setSubastas(prevSubastas => prevSubastas.filter(subasta => subasta.id !== id));


            } catch (err) {
                console.error('Error al eliminar la subasta:', err);
                toast.error('Error al eliminar la subasta');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <h2 className="text-2xl font-bold mb-6">Gestión de Subastas</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Formulario para crear subasta */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Nueva Subasta</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Seleccionar Vehículo
                            </label>
                            <select
                                name="autoId"
                                value={formData.autoId}
                                onChange={handleVehicleSelect}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="">Seleccione un vehículo disponible</option>
                                {vehicles.map(vehicle => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.marca} {vehicle.modelo} ({vehicle.anio})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedVehicle && (
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Precio Base
                                </label>
                                <input
                                    type="number"
                                    value={formData.precioMinimo}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                                    disabled
                                />
                            </div>


                        )}

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleInputChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Fecha de Fin
                            </label>
                            <input
                                type="date"
                                name="fechaFin"
                                value={formData.fechaFin}
                                onChange={handleInputChange}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>


                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                        >
                            Crear Subasta
                        </button>
                    </div>
                </form>
            </div>

            {/* Lista de subastas activas */}
            <h3 className="text-xl font-semibold mb-4">Subastas Activas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subastas.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 py-8">
                        No tienes subastas activas en este momento
                    </div>
                ) : (
                    subastas.map((subasta) => (
                        <div
                            key={subasta.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    Subasta #{subasta.id}
                                </h3>
                                <div className="text-gray-600 mb-4">
                                    <p>Auto ID: {subasta.autoId}</p>
                                    <p>Precio Mínimo: ${subasta.precioMinimo}</p>
                                    <p>Fecha Inicio: {subasta.fechaInicio} </p>
                                    <p>Fecha Fin: {subasta.fechaFin}</p>
                                    <p>Estado: {subasta.activa ? 'Activa' : 'Finalizada'}</p>
                                    {subasta.ganadorId && <p>Ganador ID: {subasta.ganadorId}</p>}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => handleDelete(subasta.id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MisSubastas; 