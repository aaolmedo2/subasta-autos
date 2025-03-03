import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Usar rutas relativas para evitar problemas de CORS
const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getUserRoleFromToken = () => {
    // Primero intentar obtener del localStorage directamente
    const roleFromStorage = localStorage.getItem('userRole');
    if (roleFromStorage) {
        return roleFromStorage;
    }

    // Si no está en localStorage, intentar decodificar el token
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const role = decoded.rol || null;
            // Guardar en localStorage para futuras consultas
            if (role) {
                localStorage.setItem('userRole', role);
            }
            return role;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    return null;
};

export const getUserIdFromToken = () => {
    // Primero intentar obtener del localStorage directamente
    const idFromStorage = localStorage.getItem('userId');
    if (idFromStorage) {
        return idFromStorage;
    }

    // Si no está en localStorage, intentar decodificar el token
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const id = decoded.id || null;
            // Guardar en localStorage para futuras consultas
            if (id) {
                localStorage.setItem('userId', id);
            }
            return id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    return null;
};

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
};

export const vehicleService = {
    getAvailableVehicles: async () => {
        const response = await api.get('/vehiculo/available');
        return response.data;
    },
    getAllVehicles: async () => {
        const response = await api.get('/vehiculo/allVehicles');
        return response.data;
    },
    getVehiclesByVendedor: async (vendedorId) => {
        const response = await api.get(`/vehiculo/getAll/${vendedorId}`);
        return response.data;
    },
    getVehicleById: async (id) => {
        const response = await api.get(`/vehiculo/${id}`);
        return response.data;
    },
    createVehicle: async (vehicleData) => {
        const response = await api.post('/vehiculo/create', vehicleData);
        return response.data;
    },
    updateVehicle: async (id, vehicleData) => {
        const response = await api.put(`/vehiculo/update/${id}`, vehicleData);
        return response.data;
    },
    deleteVehicle: async (id) => {
        const response = await api.delete(`/vehiculo/delete/${id}`);
        return response.data;
    },
};

export const auctionService = {
    createAuction: async (auctionData) => {
        const response = await api.post('/subasta/crear', auctionData);
        return response.data;
    },
    getActiveAuctions: async () => {
        const response = await api.get('/subasta/activas');
        return response.data;
    },
    getAuctionById: async (id) => {
        const response = await api.get(`/subasta/${id}`);
        return response.data;
    },
    finishAuction: async (id) => {
        const response = await api.put(`/subasta/${id}/finalizar`);
        return response.data;
    },
};

export const bidService = {
    placeBid: async (bidData) => {
        const response = await api.post('/puja/realizar', bidData);
        return response.data;
    },
    getBidsForAuction: async (auctionId) => {
        const response = await api.get(`/puja/subasta/${auctionId}`);
        return response.data;
    },
};

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/usuario/allUser');
        return response.data;
    },
    createUser: async (userData) => {
        const response = await api.post('/usuario/create', userData);
        return response.data;
    },
    updateUser: async (id, userData) => {
        const response = await api.put(`/usuario/update/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await api.put(`/usuario/delete/${id}`);
        return response.data;
    },
};

export const userRoleService = {
    createUserRole: async (userRoleData) => {
        const response = await api.post('/userRol/create', userRoleData);
        return response.data;
    },
    updateUserRole: async (userId, userRoleData) => {
        const response = await api.put(`/userRol/usuario/${userId}`, userRoleData);
        return response.data;
    },
};

export default api; 