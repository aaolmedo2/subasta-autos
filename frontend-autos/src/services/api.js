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

            const token = response.data.token || response.data;

            if (token) {
                console.log('Token received, storing in localStorage');
                localStorage.setItem('token', token);

                // Decodificar y mostrar la información del token para depuración
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log('Token payload after login:', payload);
                    console.log('User roles:', payload.authority);
                } catch (error) {
                    console.error('Error decoding token after login:', error);
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
    },

    getCurrentUserRoles: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                console.log('Getting roles from token:', token);
                const parts = token.split('.');
                if (parts.length !== 3) {
                    console.error('Invalid token format');
                    return [];
                }

                const payload = JSON.parse(atob(parts[1]));
                console.log('Token payload for roles:', payload);

                if (payload.authority) {
                    console.log('Authority found:', payload.authority);
                    // Manejar tanto string como array
                    if (typeof payload.authority === 'string') {
                        // Si es una cadena, dividir por comas y limpiar espacios
                        const roles = payload.authority.split(',').map(role => role.trim());
                        console.log('Roles procesados desde string:', roles);
                        return roles;
                    } else if (Array.isArray(payload.authority)) {
                        // Si ya es un array, usarlo directamente
                        console.log('Roles desde array:', payload.authority);
                        return payload.authority;
                    }
                    return [payload.authority]; // Si es un solo valor no string
                } else {
                    console.error('No authority field found in token');
                }
            } catch (error) {
                console.error('Error parsing JWT for roles:', error);
            }
        } else {
            console.log('No token found for getting roles');
        }
        return [];
    },

    getCurrentUserId: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('Getting user ID from payload:', payload);
                // Obtener el userId del token
                if (payload.userId) {
                    console.log('Found userId in token:', payload.userId);
                    return parseInt(payload.userId);
                }
                console.error('No userId found in token payload:', payload);
            } catch (error) {
                console.error('Error getting user ID from token:', error);
            }
        } else {
            console.log('No token found for getting user ID');
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
        // Normalizar la comparación convirtiendo todo a mayúsculas
        return roles.some(role =>
            role.trim().toUpperCase() === roleToCheck.trim().toUpperCase()
        );
    },

    hasAnyRole: (rolesToCheck) => {
        const userRoles = authService.getCurrentUserRoles();
        console.log('Checking roles:', rolesToCheck, 'against user roles:', userRoles);
        return rolesToCheck.some(role =>
            userRoles.some(userRole =>
                userRole.trim().toUpperCase() === role.trim().toUpperCase()
            )
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
            const response = await api.post('/vehiculo/create', vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error creating vehicle:', error);
            throw error;
        }
    },

    updateVehicle: async (id, vehicleData) => {
        try {
            console.log('Updating vehicle with ID:', id, 'and data:', vehicleData);
            const response = await api.put(`/vehiculo/update/${id}`, vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error updating vehicle:', error);
            throw error;
        }
    },

    deleteVehicle: async (id) => {
        try {
            console.log('Deleting vehicle with ID:', id);
            const response = await api.delete(`/vehiculo/delete/${id}`);
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

    crearSubasta: async (subastaData) => {
        try {
            console.log('Creando subasta con datos:', subastaData);
            const response = await api.post('/subasta/crear', subastaData);
            return response.data;
        } catch (error) {
            console.error('Error al crear la subasta:', error);
            throw error;
        }
    },

    getActiveSubastasByVendedor: async (vendedorId) => {
        try {
            console.log('Intentando obtener subastas para vendedor:', vendedorId);
            const response = await api.get(`/subasta/activasMine/${vendedorId}`);
            console.log('Respuesta completa de subastas del vendedor:', response);
            console.log('Subastas activas del vendedor:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error completo al obtener subastas del vendedor:', error);
            console.error('Error response:', error.response);
            throw error;
        }
    },

    realizarPuja: async (subastaId, monto) => {
        try {
            // Obtener el ID del usuario directamente del token JWT
            const compradorId = authService.getCurrentUserId();

            if (!compradorId) {
                throw new Error('No se pudo obtener el ID del usuario del token');
            }

            const pujaData = {
                subastaId: parseInt(subastaId),
                compradorId: compradorId, // Ya es un número desde getCurrentUserId
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