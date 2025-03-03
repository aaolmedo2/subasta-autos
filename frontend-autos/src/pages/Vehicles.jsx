import { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { vehicleService, getUserRoleFromToken, getUserIdFromToken } from '../services/api';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        anio: '',
        precio_base: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [viewMode, setViewMode] = useState('available');
    const [displayMode, setDisplayMode] = useState('cards');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const role = getUserRoleFromToken();
        const id = getUserIdFromToken();
        setUserRole(role);
        setUserId(id);
        loadVehicles();
    }, [viewMode]);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            setError('');
            let data;

            if (viewMode === 'all' && userRole === 'ROLE_ADMINISTRADOR') {
                console.log("Cargando todos los vehículos (admin)");
                data = await vehicleService.getAllVehicles();
            } else {
                console.log("Cargando vehículos disponibles");
                data = await vehicleService.getAvailableVehicles();
            }

            console.log("Vehículos obtenidos:", data);
            setVehicles(data || []);
        } catch (error) {
            console.error('Error loading vehicles:', error);
            setError('Error al cargar los vehículos');
        } finally {
            setLoading(false);
        }
    };

    const handleViewModeChange = (event, newMode) => {
        if (newMode !== null) {
            setViewMode(newMode);
        }
    };

    const handleDisplayModeChange = (event, newMode) => {
        if (newMode !== null) {
            setDisplayMode(newMode);
        }
    };

    const handleOpen = (vehicle = null) => {
        if (vehicle) {
            setFormData({
                marca: vehicle.marca,
                modelo: vehicle.modelo,
                anio: vehicle.anio,
                precio_base: vehicle.precio_base,
            });
            setSelectedVehicle(vehicle);
        } else {
            setFormData({
                marca: '',
                modelo: '',
                anio: '',
                precio_base: '',
            });
            setSelectedVehicle(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVehicle(null);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (selectedVehicle) {
                await vehicleService.updateVehicle(selectedVehicle.id, formData);
                setSuccess('Vehículo actualizado exitosamente');
            } else {
                // Si es vendedor, incluir su ID
                const vehicleData = {
                    ...formData,
                };

                if (userRole === 'ROLE_VENDEDOR') {
                    vehicleData.vendedorId = parseInt(userId);
                }

                await vehicleService.createVehicle(vehicleData);
                setSuccess('Vehículo creado exitosamente');
            }
            handleClose();
            loadVehicles();
        } catch (error) {
            console.error('Error saving vehicle:', error);
            setError('Error al guardar el vehículo');
        }
    };

    const handleDelete = async (id) => {
        try {
            await vehicleService.deleteVehicle(id);
            setSuccess('Vehículo eliminado exitosamente');
            loadVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            setError('Error al eliminar el vehículo');
        }
    };

    // Verificar si el usuario puede editar/eliminar un vehículo
    const canEditVehicle = (vehicle) => {
        if (userRole === 'ROLE_ADMINISTRADOR') return true;
        if (userRole === 'ROLE_VENDEDOR' && vehicle.vendedorId === parseInt(userId)) return true;
        return false;
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Vehículos
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    {userRole === 'ROLE_ADMINISTRADOR' && (
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={handleViewModeChange}
                            aria-label="modo de visualización"
                            sx={{ mr: 2 }}
                        >
                            <ToggleButton value="available" aria-label="disponibles">
                                Vehículos Disponibles
                            </ToggleButton>
                            <ToggleButton value="all" aria-label="todos">
                                Todos los Vehículos
                            </ToggleButton>
                        </ToggleButtonGroup>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tabs value={displayMode} onChange={handleDisplayModeChange} aria-label="display mode" sx={{ mr: 2 }}>
                        <Tab label="Tarjetas" value="cards" />
                        <Tab label="Tabla" value="table" />
                    </Tabs>

                    {(userRole === 'ROLE_ADMINISTRADOR' || userRole === 'ROLE_VENDEDOR') && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => handleOpen()}
                        >
                            Agregar Vehículo
                        </Button>
                    )}
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : vehicles.length === 0 ? (
                <Alert severity="info">
                    No hay vehículos disponibles en este momento.
                </Alert>
            ) : displayMode === 'cards' ? (
                <Grid container spacing={3}>
                    {vehicles.map((vehicle) => (
                        <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {vehicle.marca} {vehicle.modelo}
                                    </Typography>
                                    <Typography color="text.secondary" gutterBottom>
                                        Año: {vehicle.anio}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Precio Base: ${vehicle.precio_base}
                                    </Typography>
                                    {viewMode === 'all' && (
                                        <Typography variant="body2">
                                            ID Vendedor: {vehicle.vendedorId || 'No asignado'}
                                        </Typography>
                                    )}
                                </CardContent>
                                {canEditVehicle(vehicle) && (
                                    <CardActions>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpen(vehicle)}
                                            startIcon={<Edit />}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(vehicle.id)}
                                            startIcon={<Delete />}
                                        >
                                            Eliminar
                                        </Button>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Marca</TableCell>
                                <TableCell>Modelo</TableCell>
                                <TableCell>Año</TableCell>
                                <TableCell>Precio Base</TableCell>
                                {viewMode === 'all' && <TableCell>ID Vendedor</TableCell>}
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vehicles.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell>{vehicle.id}</TableCell>
                                    <TableCell>{vehicle.marca}</TableCell>
                                    <TableCell>{vehicle.modelo}</TableCell>
                                    <TableCell>{vehicle.anio}</TableCell>
                                    <TableCell>${vehicle.precio_base}</TableCell>
                                    {viewMode === 'all' && <TableCell>{vehicle.vendedorId || 'No asignado'}</TableCell>}
                                    <TableCell>
                                        {canEditVehicle(vehicle) ? (
                                            <>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleOpen(vehicle)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(vehicle.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No disponible
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedVehicle ? 'Editar Vehículo' : 'Agregar Vehículo'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="marca"
                        label="Marca"
                        fullWidth
                        value={formData.marca}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="modelo"
                        label="Modelo"
                        fullWidth
                        value={formData.modelo}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="anio"
                        label="Año"
                        type="number"
                        fullWidth
                        value={formData.anio}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="precio_base"
                        label="Precio Base"
                        type="number"
                        fullWidth
                        value={formData.precio_base}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Vehicles; 