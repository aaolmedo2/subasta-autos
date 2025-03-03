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
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { vehicleService, getUserIdFromToken } from '../services/api';

const SellerVehicles = () => {
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
    const [vendedorId, setVendedorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('cards');

    useEffect(() => {
        const userId = getUserIdFromToken();
        console.log("ID del vendedor:", userId);
        setVendedorId(userId);
        if (userId) {
            loadSellerVehicles(userId);
        }
    }, []);

    const loadSellerVehicles = async (id) => {
        try {
            setLoading(true);
            setError('');
            console.log("Cargando vehículos para vendedor ID:", id);
            const data = await vehicleService.getVehiclesByVendedor(id);
            console.log("Vehículos obtenidos:", data);
            setVehicles(data || []);
        } catch (error) {
            console.error('Error loading seller vehicles:', error);
            setError('Error al cargar los vehículos del vendedor');
        } finally {
            setLoading(false);
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
                // Asegurarse de incluir el ID del vendedor
                const vehicleData = {
                    ...formData,
                    vendedorId: parseInt(vendedorId),
                };
                console.log("Datos del vehículo a crear:", vehicleData);
                await vehicleService.createVehicle(vehicleData);
                setSuccess('Vehículo creado exitosamente');
            }
            handleClose();
            if (vendedorId) {
                loadSellerVehicles(vendedorId);
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
            setError('Error al guardar el vehículo');
        }
    };

    const handleDelete = async (id) => {
        try {
            await vehicleService.deleteVehicle(id);
            setSuccess('Vehículo eliminado exitosamente');
            if (vendedorId) {
                loadSellerVehicles(vendedorId);
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            setError('Error al eliminar el vehículo');
        }
    };

    const handleViewModeChange = (event, newValue) => {
        setViewMode(newValue);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Mis Vehículos
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
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleOpen()}
                >
                    Agregar Vehículo
                </Button>

                <Tabs value={viewMode} onChange={handleViewModeChange} aria-label="view mode">
                    <Tab label="Tarjetas" value="cards" />
                    <Tab label="Tabla" value="table" />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : vehicles.length === 0 ? (
                <Alert severity="info">
                    No tienes vehículos registrados. ¡Agrega uno nuevo!
                </Alert>
            ) : viewMode === 'cards' ? (
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
                                    <Typography variant="body2">
                                        Precio Base: ${vehicle.precio_base}
                                    </Typography>
                                </CardContent>
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
                                    <TableCell>
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

export default SellerVehicles; 