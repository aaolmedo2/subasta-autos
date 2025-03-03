import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { userService, userRoleService } from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contraseniaHash: '',
        rol: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');
            console.log("Cargando usuarios...");
            const data = await userService.getAllUsers();
            console.log("Usuarios obtenidos:", data);
            setUsers(data || []);
        } catch (error) {
            console.error('Error loading users:', error);
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (user = null) => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                email: user.email || '',
                contraseniaHash: '',
                rol: user.rol || '',
            });
            setSelectedUser(user);
        } else {
            setFormData({
                nombre: '',
                email: '',
                contraseniaHash: '',
                rol: '',
            });
            setSelectedUser(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
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
            if (selectedUser) {
                // Actualizar usuario existente
                const userData = {
                    nombre: formData.nombre,
                    email: formData.email,
                };

                // Solo incluir contraseña si se ha proporcionado una nueva
                if (formData.contraseniaHash) {
                    userData.contraseniaHash = formData.contraseniaHash;
                }

                await userService.updateUser(selectedUser.id, userData);

                // Actualizar rol si es necesario
                if (formData.rol && formData.rol !== selectedUser.rol) {
                    await userRoleService.updateUserRole(selectedUser.id, { rolId: getRolId(formData.rol) });
                }

                setSuccess('Usuario actualizado exitosamente');
            } else {
                // Crear nuevo usuario
                const userData = {
                    nombre: formData.nombre,
                    email: formData.email,
                    contraseniaHash: formData.contraseniaHash,
                };

                const response = await userService.createUser(userData);

                // Asignar rol al nuevo usuario
                if (formData.rol) {
                    await userRoleService.createUserRole({
                        usuarioId: response.id,
                        rolId: getRolId(formData.rol),
                    });
                }

                setSuccess('Usuario creado exitosamente');
            }

            handleClose();
            loadUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            setError('Error al guardar el usuario');
        }
    };

    const handleDelete = async (id) => {
        try {
            await userService.deleteUser(id);
            setSuccess('Usuario eliminado exitosamente');
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Error al eliminar el usuario');
        }
    };

    // Función auxiliar para obtener el ID del rol basado en el nombre
    const getRolId = (rolName) => {
        switch (rolName) {
            case 'ROLE_ADMINISTRADOR':
                return 1;
            case 'ROLE_VENDEDOR':
                return 2;
            case 'ROLE_COMPRADOR':
                return 3;
            default:
                return 3; // Por defecto, asignar rol de comprador
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Usuarios
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

            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
            >
                Nuevo Usuario
            </Button>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No hay usuarios registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.nombre}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.rol || 'Sin rol'}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleOpen(user)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="nombre"
                        label="Nombre"
                        fullWidth
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="contraseniaHash"
                        label={selectedUser ? "Nueva Contraseña (dejar en blanco para mantener)" : "Contraseña"}
                        type="password"
                        fullWidth
                        value={formData.contraseniaHash}
                        onChange={handleChange}
                        required={!selectedUser}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Rol</InputLabel>
                        <Select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                        >
                            <MenuItem value="ROLE_ADMINISTRADOR">Administrador</MenuItem>
                            <MenuItem value="ROLE_VENDEDOR">Vendedor</MenuItem>
                            <MenuItem value="ROLE_COMPRADOR">Comprador</MenuItem>
                        </Select>
                    </FormControl>
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

export default AdminUsers; 