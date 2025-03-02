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
            state.user = jwtDecode(action.payload);
            state.error = null;
            localStorage.setItem('token', action.payload);
        },
        loginFailure: (state, action) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
            localStorage.removeItem('token');
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer; 