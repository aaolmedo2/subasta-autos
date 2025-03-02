import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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
    placeBid: async (bidData) => {
        const response = await api.post('/puja/realizar', bidData);
        return response.data;
    },
    getBidsForAuction: async (auctionId) => {
        const response = await api.get(`/puja/subasta/${auctionId}`);
        return response.data;
    },
};

export default api; 