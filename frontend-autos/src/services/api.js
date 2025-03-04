import axios from 'axios';

// Cambiamos a URL relativa para usar el proxy de Vite
const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Caché para almacenar el ID del usuario por email
const userIdCache = new Map();

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            console.log('Login response:', response.data);

            // Verificar si la respuesta contiene un token directamente o dentro de un objeto
            const token = response.data.token || response.data;

            if (token) {
                console.log('Token received, storing in localStorage');
                localStorage.setItem('token', token);

                // Guardar el email del usuario para futuras referencias
                if (credentials.email) {
                    localStorage.setItem('userEmail', credentials.email);
                }
            } else {
                console.error('No token found in response:', response.data);
            }

            return response.data;
        } catch (error) {
            console.error('Login error in service:', error);
            throw error;
        }
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        userIdCache.clear();
    },

    getCurrentUserRoles: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                console.log('Parsing token:', token);
                const parts = token.split('.');
                if (parts.length !== 3) {
                    console.error('Invalid token format');
                    return [];
                }

                const payload = JSON.parse(atob(parts[1]));
                console.log('Token payload:', payload);

                // Check if authority exists and split it into roles
                if (payload.authority) {
                    console.log('Authority found:', payload.authority);
                    // Handle both single role and multiple roles cases
                    return typeof payload.authority === 'string'
                        ? payload.authority.split(',')
                        : [payload.authority];
                } else {
                    console.error('No authority field found in token');
                }
            } catch (error) {
                console.error('Error parsing JWT:', error);
            }
        } else {
            console.log('No token found in localStorage');
        }
        return [];
    },

    getCurrentUserId: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Intentar obtener el ID del usuario del token
                if (payload.userId) {
                    return payload.userId;
                }

                // Si no está en el token, intentar obtenerlo del email
                const userEmail = localStorage.getItem('userEmail');
                if (userEmail && userIdCache.has(userEmail)) {
                    return userIdCache.get(userEmail);
                }

                // Si no tenemos el ID, usamos el sub (email) como identificador temporal
                return payload.sub;
            } catch (error) {
                console.error('Error getting user ID from token:', error);
            }
        }
        return null;
    },

    getUserIdByEmail: async (email) => {
        // Si ya tenemos el ID en caché, lo devolvemos
        if (userIdCache.has(email)) {
            return userIdCache.get(email);
        }

        try {
            // Aquí deberías tener un endpoint que te permita obtener el ID del usuario por email
            // Por ejemplo: /api/usuario/findByEmail?email=test@example.com
            const response = await api.get(`/usuario/findByEmail?email=${encodeURIComponent(email)}`);
            const userId = response.data.id;

            // Guardar en caché para futuras referencias
            if (userId) {
                userIdCache.set(email, userId);
            }

            return userId;
        } catch (error) {
            console.error('Error getting user ID by email:', error);
            return null;
        }
    },

    hasRole: (roleToCheck) => {
        const roles = authService.getCurrentUserRoles();
        console.log('Checking role:', roleToCheck, 'against user roles:', roles);
        return roles.some(role => role.trim() === roleToCheck.trim());
    },

    hasAnyRole: (rolesToCheck) => {
        const userRoles = authService.getCurrentUserRoles();
        console.log('Checking roles:', rolesToCheck, 'against user roles:', userRoles);
        return rolesToCheck.some(role =>
            userRoles.some(userRole => userRole.trim() === role.trim())
        );
    }
};

export const vehicleService = {
    getAllVehicles: async () => {
        try {
            const response = await api.get('/vehiculo/getAllVehicles');
            console.log('All vehicles:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            throw error;
        }
    },

    getVehiclesByVendedor: async (vendedorId) => {
        try {
            console.log('Getting vehicles for vendedor ID:', vendedorId);
            const response = await api.get(`/vehiculo/getAll/${vendedorId}`);
            console.log('Vehicles by vendedor:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicles by vendedor:', error);
            throw error;
        }
    },

    createVehicle: async (vehicleData) => {
        try {
            console.log('Creating vehicle with data:', vehicleData);
            const response = await api.post('/vehiculo', vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error creating vehicle:', error);
            throw error;
        }
    },

    updateVehicle: async (id, vehicleData) => {
        try {
            console.log('Updating vehicle with ID:', id, 'and data:', vehicleData);
            const response = await api.put(`/vehiculo/update`, vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error updating vehicle:', error);
            throw error;
        }
    },

    deleteVehicle: async (id) => {
        try {
            console.log('Deleting vehicle with ID:', id);
            const response = await api.delete(`/vehiculo/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            throw error;
        }
    }
};

export const subastaService = {
    getActiveSubastas: async () => {
        try {
            const response = await api.get('/subasta/activas');
            console.log('Subastas activas:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching active subastas:', error);
            throw error;
        }
    },

    realizarPuja: async (subastaId, monto) => {
        try {
            // Obtener el email del usuario actual
            const userEmail = localStorage.getItem('userEmail');
            let compradorId = null;

            // Intentar obtener el ID del usuario
            if (userEmail) {
                // Primero intentamos obtener el ID del caché
                if (userIdCache.has(userEmail)) {
                    compradorId = userIdCache.get(userEmail);
                } else {
                    // Si no está en caché, intentamos obtenerlo del backend
                    compradorId = await authService.getUserIdByEmail(userEmail);
                }
            }

            // Si no pudimos obtener el ID, usamos el ID del token
            if (!compradorId) {
                compradorId = authService.getCurrentUserId();
            }

            if (!compradorId) {
                throw new Error('No se pudo obtener el ID del usuario');
            }

            // Asegurarse de que compradorId sea un número
            if (isNaN(parseInt(compradorId))) {
                console.error('compradorId no es un número:', compradorId);
                throw new Error('El ID del comprador debe ser un número');
            }

            const pujaData = {
                subastaId: parseInt(subastaId),
                compradorId: parseInt(compradorId),
                monto: parseFloat(monto),
                fechaPuja: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
            };

            console.log('Enviando puja:', pujaData);
            const response = await api.post('/puja/realizar', pujaData);
            return response.data;
        } catch (error) {
            console.error('Error realizando puja:', error);
            throw error;
        }
    },

    getAutoDetails: async (autoId) => {
        const response = await api.get(`/vehiculo/${autoId}`);
        return response.data;
    },

    finalizarSubasta: async (subastaId) => {
        try {
            const response = await api.put(`/subasta/${subastaId}/finalizar`);
            return response.data;
        } catch (error) {
            console.error('Error finalizando subasta:', error);
            throw error;
        }
    }
};

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/usuario/allUser');
            console.log('All users:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
};

export default api; 