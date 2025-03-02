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
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { auctionService, vehicleService } from '../services/api';

const Auctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [open, setOpen] = useState(false);
    const [bidDialogOpen, setBidDialogOpen] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [formData, setFormData] = useState({
        autoId: '',
        fechaInicio: '',
        fechaFin: '',
        precioMinimo: '',
    });
    const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
        loadAuctions();
        loadVehicles();
    }, []);

    const loadAuctions = async () => {
        try {
            const data = await auctionService.getActiveAuctions();
            setAuctions(data);
        } catch (error) {
            console.error('Error loading auctions:', error);
        }
    };

    const loadVehicles = async () => {
        try {
            const data = await vehicleService.getAvailableVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Error loading vehicles:', error);
        }
    };

    const handleOpen = () => {
        setFormData({
            autoId: '',
            fechaInicio: '',
            fechaFin: '',
            precioMinimo: '',
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
            await auctionService.createAuction(formData);
            handleClose();
            loadAuctions();
        } catch (error) {
            console.error('Error creating auction:', error);
        }
    };

    const handleBidDialogOpen = async (auction) => {
        setSelectedAuction(auction);
        try {
            const bidsData = await auctionService.getBidsForAuction(auction.id);
            setBids(bidsData);
        } catch (error) {
            console.error('Error loading bids:', error);
        }
        setBidDialogOpen(true);
    };

    const handleBidDialogClose = () => {
        setBidDialogOpen(false);
        setSelectedAuction(null);
        setBidAmount('');
    };

    const handlePlaceBid = async () => {
        try {
            await auctionService.placeBid({
                subastaId: selectedAuction.id,
                monto: parseFloat(bidAmount),
            });
            handleBidDialogClose();
            loadAuctions();
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpen}
                        sx={{ mb: 2 }}
                    >
                        Crear Subasta
                    </Button>
                </Grid>
                {auctions.map((auction) => (
                    <Grid item xs={12} sm={6} md={4} key={auction.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Subasta #{auction.id}
                                </Typography>
                                <Typography color="text.secondary">
                                    Vehículo: {auction.autoId}
                                </Typography>
                                <Typography variant="body2">
                                    Precio Mínimo: ${auction.precioMinimo}
                                </Typography>
                                <Typography variant="body2">
                                    Fecha Inicio: {new Date(auction.fechaInicio).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    Fecha Fin: {new Date(auction.fechaFin).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleBidDialogOpen(auction)}
                                >
                                    Ver Pujas
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Crear Nueva Subasta</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        margin="dense"
                        name="autoId"
                        label="Vehículo"
                        fullWidth
                        value={formData.autoId}
                        onChange={handleChange}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="">Seleccione un vehículo</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.marca} {vehicle.modelo} ({vehicle.anio})
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        name="fechaInicio"
                        label="Fecha de Inicio"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formData.fechaInicio}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="fechaFin"
                        label="Fecha de Fin"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formData.fechaFin}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="precioMinimo"
                        label="Precio Mínimo"
                        type="number"
                        fullWidth
                        value={formData.precioMinimo}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={bidDialogOpen} onClose={handleBidDialogClose}>
                <DialogTitle>Pujas de la Subasta</DialogTitle>
                <DialogContent>
                    <List>
                        {bids.map((bid) => (
                            <ListItem key={bid.id}>
                                <ListItemText
                                    primary={`$${bid.monto}`}
                                    secondary={`Usuario: ${bid.usuarioId}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <TextField
                        margin="dense"
                        label="Monto de la Puja"
                        type="number"
                        fullWidth
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBidDialogClose}>Cerrar</Button>
                    <Button onClick={handlePlaceBid} variant="contained" color="primary">
                        Realizar Puja
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Auctions; 