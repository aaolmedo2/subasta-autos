import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    Divider,
    Chip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    DirectionsCar,
    Gavel,
    ExitToApp,
    Person,
    MonetizationOn,
    AdminPanelSettings,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { getUserRoleFromToken } from '../services/api';

const drawerWidth = 240;

// Función para obtener el nombre amigable del rol
const getRoleName = (role) => {
    switch (role) {
        case 'ROLE_ADMINISTRADOR':
            return 'Administrador';
        case 'ROLE_VENDEDOR':
            return 'Vendedor';
        case 'ROLE_COMPRADOR':
            return 'Comprador';
        default:
            return role;
    }
};

// Función para obtener el color del chip según el rol
const getRoleColor = (role) => {
    switch (role) {
        case 'ROLE_ADMINISTRADOR':
            return 'error';
        case 'ROLE_VENDEDOR':
            return 'success';
        case 'ROLE_COMPRADOR':
            return 'primary';
        default:
            return 'default';
    }
};

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const role = getUserRoleFromToken();
        setUserRole(role);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Menú común para todos los usuarios
    const commonMenuItems = [
        { text: 'Vehículos Disponibles', icon: <DirectionsCar />, path: '/dashboard/vehicles' },
        { text: 'Subastas Activas', icon: <Gavel />, path: '/dashboard/auctions' },
        { text: 'Pujas', icon: <MonetizationOn />, path: '/dashboard/bids' },
    ];

    // Menú específico para vendedores
    const sellerMenuItems = userRole === 'ROLE_VENDEDOR' ? [
        { text: 'Mis Vehículos', icon: <DirectionsCar />, path: '/dashboard/seller-vehicles' },
    ] : [];

    // Menú específico para administradores
    const adminMenuItems = userRole === 'ROLE_ADMINISTRADOR' ? [
        { text: 'Gestión de Usuarios', icon: <AdminPanelSettings />, path: '/dashboard/admin/users' },
    ] : [];

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {commonMenuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>

            {sellerMenuItems.length > 0 && (
                <>
                    <Divider />
                    <List>
                        {sellerMenuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {adminMenuItems.length > 0 && (
                <>
                    <Divider />
                    <List>
                        {adminMenuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Subasta de Autos
                    </Typography>

                    {userRole && (
                        <Chip
                            label={getRoleName(userRole)}
                            color={getRoleColor(userRole)}
                            icon={<Person />}
                            sx={{ mr: 2 }}
                        />
                    )}

                    <Button color="inherit" onClick={handleLogout} startIcon={<ExitToApp />}>
                        Cerrar Sesión
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout; 