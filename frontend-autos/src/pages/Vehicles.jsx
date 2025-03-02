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
} from '@mui/material';
import { vehicleService } from '../services/api';

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

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await vehicleService.getAvailableVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Error loading vehicles:', error);
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
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedVehicle) {
                await vehicleService.updateVehicle(selectedVehicle.id, formData);
            } else {
                await vehicleService.createVehicle(formData);
            }
            handleClose();
            loadVehicles();
        } catch (error) {
            console.error('Error saving vehicle:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await vehicleService.deleteVehicle(id);
            loadVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpen()}
                        sx={{ mb: 2 }}
                    >
                        Agregar Vehículo
                    </Button>
                </Grid>
                {vehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {vehicle.marca} {vehicle.modelo}
                                </Typography>
                                <Typography color="text.secondary">
                                    Año: {vehicle.anio}
                                </Typography>
                                <Typography variant="body2">
                                    Precio Base: ${vehicle.precio_base}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleOpen(vehicle)}>
                                    Editar
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(vehicle.id)}
                                >
                                    Eliminar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
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