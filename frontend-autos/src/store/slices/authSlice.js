import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            const decodedToken = jwtDecode(action.payload);
            state.user = decodedToken;
            state.error = null;
            localStorage.setItem('token', action.payload);

            // Guardar el ID del usuario en localStorage para acceso fácil
            if (decodedToken && decodedToken.id) {
                localStorage.setItem('userId', decodedToken.id);
            }

            // Guardar el rol del usuario en localStorage para acceso fácil
            if (decodedToken && decodedToken.rol) {
                localStorage.setItem('userRole', decodedToken.rol);
            }
        },
        loginFailure: (state, action) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
        },
    },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer; 