import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';

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
        precio: '',
        descripcion: ''
    });

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await vehicleService.getVehiclesByVendedor();
            setVehicles(data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los vehículos');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            marca: '',
            modelo: '',
            anio: '',
            precio: '',
            descripcion: ''
        });
        setSelectedVehicle(null);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await vehicleService.updateVehicle(selectedVehicle.id, formData);
            } else {
                await vehicleService.createVehicle(formData);
            }
            await loadVehicles();
            resetForm();
        } catch (err) {
            setError(isEditing ? 'Error al actualizar el vehículo' : 'Error al crear el vehículo');
        }
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            anio: vehicle.anio,
            precio: vehicle.precio,
            descripcion: vehicle.descripcion
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
            try {
                await vehicleService.deleteVehicle(id);
                await loadVehicles();
            } catch (err) {
                setError('Error al eliminar el vehículo');
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
            <h2 className="text-2xl font-bold mb-6">Mis Vehículos</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

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
                                Precio
                            </label>
                            <input
                                type="number"
                                name="precio"
                                value={formData.precio}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3"
                            required
                        />
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
                        key={vehicle.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{vehicle.marca} {vehicle.modelo}</h3>
                            <div className="text-gray-600 mb-4">
                                <p>Año: {vehicle.anio}</p>
                                <p>Precio: ${vehicle.precio}</p>
                                <p className="mt-2">{vehicle.descripcion}</p>
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