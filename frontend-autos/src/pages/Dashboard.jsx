import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserRoleFromToken } from '../services/api';
import Vehicles from './Vehicles';
import Auctions from './Auctions';
import SellerVehicles from './SellerVehicles';
import Bids from './Bids';
import AdminUsers from './AdminUsers';

const Dashboard = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = getUserRoleFromToken();
        setUserRole(role);
    }, []);

    return (
        <Routes>
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="auctions" element={<Auctions />} />
            {userRole === 'ROLE_VENDEDOR' && (
                <Route path="seller-vehicles" element={<SellerVehicles />} />
            )}
            <Route path="bids" element={<Bids />} />
            {userRole === 'ROLE_ADMINISTRADOR' && (
                <Route path="admin/users" element={<AdminUsers />} />
            )}
            <Route path="/" element={<Navigate to="vehicles" />} />
        </Routes>
    );
};

export default Dashboard; 