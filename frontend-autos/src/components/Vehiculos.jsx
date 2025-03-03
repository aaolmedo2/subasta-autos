import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';

const Vehiculos = () => {
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

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await vehicleService.getAllVehicles();
            console.log('Vehículos cargados:', data);
            setVehicles(data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar los vehículos:', err);
            setError('Error al cargar los vehículos');
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
            id_vendedor: ''
        });
        setSelectedVehicle(null);
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Para actualizar, necesitamos adaptar los datos al formato esperado
                const updateData = {
                    nombre: formData.marca, // Usando marca como nombre
                    email: formData.modelo, // Usando modelo como email
                    password: "", // Campo vacío
                    activo: formData.estado,
                    fecha_registro: new Date().toISOString().split('T')[0] // Fecha actual
                };

                await vehicleService.updateVehicle(selectedVehicle.id_vendedor, updateData);
            } else {
                await vehicleService.createVehicle(formData);
            }
            await loadVehicles();
            resetForm();
        } catch (err) {
            console.error('Error al guardar el vehículo:', err);
            setError(isEditing ? 'Error al actualizar el vehículo' : 'Error al crear el vehículo');
        }
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
        setFormData({
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
                await loadVehicles();
            } catch (err) {
                console.error('Error al eliminar el vehículo:', err);
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
            <h2 className="text-2xl font-bold mb-6">Gestión de Vehículos</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehículo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Año
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio Base
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id_vendedor}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {vehicle.marca} {vehicle.modelo}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{vehicle.anio}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">${vehicle.precio_base}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {vehicle.estado ? 'Disponible' : 'No disponible'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {vehicle.fecha ? new Date(vehicle.fecha).toLocaleDateString() : 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(vehicle)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vehicle.id_vendedor)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de edición */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            Editar Vehículo
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehiculos; 