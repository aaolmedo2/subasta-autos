import React, { useState, useEffect } from 'react';
import { vehicleService, authService } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MisVehiculos = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        anio: '',
        precio_base: '',
        estado: false,
        id_vendedor: ''
    });
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        // Obtener el ID del usuario actual desde el token JWT
        const userId = authService.getCurrentUserId();
        console.log('Current user ID:', userId);
        setCurrentUserId(userId);

        if (userId) {
            loadVehicles(userId);
        } else {
            setError('No se pudo obtener el ID del usuario');
            setLoading(false);
        }
    }, []);

    const loadVehicles = async (vendedorId) => {
        try {
            console.log('Loading vehicles for vendedor ID:', vendedorId);
            const data = await vehicleService.getVehiclesByVendedor(vendedorId);
            console.log('Vehículos cargados:', data);
            setVehicles(data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar los vehículos:', err);
            toast.error('Error al cargar los vehículos');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            marca: '',
            modelo: '',
            anio: '',
            precio_base: '',
            estado: false,
            id_vendedor: currentUserId || ''
        });
        setSelectedVehicle(null);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const vehicleData = {
                ...formData,
                id_vendedor: currentUserId
            };

            if (isEditing) {
                const updateData = {
                    id: selectedVehicle.id,
                    marca: formData.marca,
                    modelo: formData.modelo,
                    anio: formData.anio,
                    precio_base: formData.precio_base,
                    estado: formData.estado,
                    fecha_registro: new Date().toISOString().split('T')[0]
                };

                await vehicleService.updateVehicle(selectedVehicle.id, updateData);
                toast.success('¡Vehículo actualizado con éxito!');
            } else {
                await vehicleService.createVehicle(vehicleData);
                toast.success('¡Vehículo creado con éxito!');
            }

            if (currentUserId) {
                await loadVehicles(currentUserId);
            }
            resetForm();
        } catch (err) {
            console.error('Error al guardar el vehículo:', err);
            toast.error(isEditing ? 'Error al actualizar el vehículo' : 'Error al crear el vehículo');
        }
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            id: vehicle.id,
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            anio: vehicle.anio,
            precio_base: vehicle.precio_base,
            estado: vehicle.estado,
            id_vendedor: vehicle.id_vendedor
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
            try {
                await vehicleService.deleteVehicle(id);
                toast.success('¡Vehículo eliminado con éxito!');
                if (currentUserId) {
                    await loadVehicles(currentUserId);
                }
            } catch (err) {
                console.error('Error al eliminar el vehículo:', err);
                toast.error('Error al eliminar el vehículo');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Cargando vehículos...</div>
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
            <h2 className="text-2xl font-bold mb-6">Mis Vehículos</h2>

            {/* Formulario para crear/editar vehículo */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                    {isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Marca
                            </label>
                            <input
                                type="text"
                                name="marca"
                                value={formData.marca}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Modelo
                            </label>
                            <input
                                type="text"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Año
                            </label>
                            <input
                                type="number"
                                name="anio"
                                value={formData.anio}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Precio Base
                            </label>
                            <input
                                type="number"
                                name="precio_base"
                                value={formData.precio_base}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="estado"
                            id="estado"
                            checked={formData.estado}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="estado" className="ml-2 block text-sm text-gray-900">
                            Disponible
                        </label>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                        >
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Lista de vehículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.id_vendedor}

                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{vehicle.marca} {vehicle.modelo}</h3>
                            <div className="text-gray-600 mb-4">
                                <p>Año: {vehicle.anio}</p>
                                <p>ID: {vehicle.id}</p>
                                <p>Precio Base: ${vehicle.precio_base}</p>
                                <p>Estado: {vehicle.estado ? 'Disponible' : 'No disponible'}</p>
                                {vehicle.fecha && <p>Fecha: {new Date(vehicle.fecha).toLocaleDateString()}</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(vehicle)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(vehicle.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisVehiculos; 