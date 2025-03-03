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
    Alert,
    Paper,
    Divider,
    CircularProgress,
    Box,
} from '@mui/material';
import { auctionService, bidService, vehicleService, getUserRoleFromToken, getUserIdFromToken } from '../services/api';

const Bids = () => {
    const [auctions, setAuctions] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const id = getUserIdFromToken();
        const role = getUserRoleFromToken();
        setUserId(id);
        setUserRole(role);
        loadAuctions();
        if (role === 'ROLE_VENDEDOR') {
            loadVehicles(id);
        }
    }, []);

    const loadAuctions = async () => {
        try {
            setLoading(true);
            setError('');
            console.log("Cargando subastas activas...");
            const data = await auctionService.getActiveAuctions();
            console.log("Subastas obtenidas:", data);
            setAuctions(data || []);
        } catch (error) {
            console.error('Error loading auctions:', error);
            setError('Error al cargar las subastas activas');
        } finally {
            setLoading(false);
        }
    };

    const loadVehicles = async (vendedorId) => {
        try {
            const data = await vehicleService.getVehiclesByVendedor(vendedorId);
            setVehicles(data || []);
        } catch (error) {
            console.error('Error loading vehicles:', error);
        }
    };

    const handleOpenBidDialog = async (auction) => {
        setSelectedAuction(auction);
        try {
            // Cargar información del vehículo
            const vehicleData = await vehicleService.getVehicleById(auction.autoId);
            setSelectedVehicle(vehicleData);

            // Cargar pujas
            const bidsData = await bidService.getBidsForAuction(auction.id);
            setBids(bidsData || []);

            setOpen(true);
        } catch (error) {
            console.error('Error loading bids:', error);
            setError('Error al cargar las pujas de la subasta');
        }
    };

    const handleCloseBidDialog = () => {
        setOpen(false);
        setSelectedAuction(null);
        setSelectedVehicle(null);
        setBidAmount('');
        setError('');
    };

    const handlePlaceBid = async () => {
        if (!bidAmount || parseFloat(bidAmount) <= 0) {
            setError('Por favor, ingrese un monto válido para la puja');
            return;
        }

        try {
            await bidService.placeBid({
                subastaId: selectedAuction.id,
                usuarioId: parseInt(userId),
                monto: parseFloat(bidAmount),
            });

            // Recargar las pujas para esta subasta
            const bidsData = await bidService.getBidsForAuction(selectedAuction.id);
            setBids(bidsData || []);

            setBidAmount('');
            setSuccess('Puja realizada exitosamente');
        } catch (error) {
            console.error('Error placing bid:', error);
            setError('Error al realizar la puja');
        }
    };

    // Verificar si el usuario es el vendedor del vehículo
    const isVehicleSeller = (vehicleId) => {
        if (!vehicles || !userId || userRole !== 'ROLE_VENDEDOR') return false;

        const vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle && vehicle.vendedorId === parseInt(userId);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Pujas en Subastas Activas
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {auctions.length === 0 ? (
                        <Grid item xs={12}>
                            <Alert severity="info">
                                No hay subastas activas en este momento.
                            </Alert>
                        </Grid>
                    ) : (
                        auctions.map((auction) => (
                            <Grid item xs={12} sm={6} md={4} key={auction.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            Subasta #{auction.id}
                                        </Typography>
                                        <Typography color="text.secondary" gutterBottom>
                                            Vehículo ID: {auction.autoId}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            Precio Mínimo: ${auction.precioMinimo}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            Fecha Inicio: {new Date(auction.fechaInicio).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            Fecha Fin: {new Date(auction.fechaFin).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleOpenBidDialog(auction)}
                                            disabled={isVehicleSeller(auction.autoId)}
                                        >
                                            {isVehicleSeller(auction.autoId)
                                                ? 'No puedes pujar por tu propio vehículo'
                                                : 'Ver Detalles / Pujar'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            <Dialog open={open} onClose={handleCloseBidDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    Detalles de la Subasta #{selectedAuction?.id}
                </DialogTitle>
                <DialogContent>
                    {selectedVehicle && (
                        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Información del Vehículo
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Marca:</strong> {selectedVehicle.marca}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Modelo:</strong> {selectedVehicle.modelo}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Año:</strong> {selectedVehicle.anio}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Precio Base:</strong> ${selectedVehicle.precio_base}
                                    </Typography>
                                    {selectedAuction && (
                                        <Typography variant="body1">
                                            <strong>Precio Mínimo de Subasta:</strong> ${selectedAuction.precioMinimo}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>
                        Pujas Actuales
                    </Typography>

                    {bids.length === 0 ? (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            No hay pujas para esta subasta todavía.
                        </Alert>
                    ) : (
                        <Paper variant="outlined" sx={{ mb: 3 }}>
                            <List>
                                {bids.map((bid) => (
                                    <ListItem key={bid.id} divider>
                                        <ListItemText
                                            primary={`$${bid.monto}`}
                                            secondary={`Usuario ID: ${bid.usuarioId} - Fecha: ${new Date(bid.fecha).toLocaleString()}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}

                    {!isVehicleSeller(selectedAuction?.autoId) && (
                        <>
                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom>
                                Realizar Nueva Puja
                            </Typography>

                            <TextField
                                margin="dense"
                                label="Monto de la Puja"
                                type="number"
                                fullWidth
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                error={!!error && error.includes('monto')}
                                helperText={error && error.includes('monto') ? error : ''}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBidDialog}>Cerrar</Button>
                    {!isVehicleSeller(selectedAuction?.autoId) && (
                        <Button onClick={handlePlaceBid} variant="contained" color="primary">
                            Realizar Puja
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Bids; 