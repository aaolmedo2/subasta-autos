import React, { useState, useEffect } from 'react';
import { vehicleService, authService } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MisVehiculosC = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
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
                                <p>ID Auto: {vehicle.id}</p>
                                <p>Precio COMPRA: ${vehicle.precio_base}</p>
                                <p>Estado COMPRADO: {vehicle.estado ? 'Disponible' : 'No disponible'}</p>
                                {vehicle.fecha && <p>Fecha COMPRA: {new Date(vehicle.fecha).toLocaleDateString()}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisVehiculosC; 