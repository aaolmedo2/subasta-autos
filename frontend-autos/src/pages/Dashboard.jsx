import { Routes, Route, Navigate } from 'react-router-dom';
import Vehicles from './Vehicles';
import Auctions from './Auctions';

const Dashboard = () => {
    return (
        <Routes>
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="auctions" element={<Auctions />} />
            <Route path="/" element={<Navigate to="vehicles" />} />
        </Routes>
    );
};

export default Dashboard; 