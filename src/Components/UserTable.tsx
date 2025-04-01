import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Pagination,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
}

function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=6`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      setSnackbar({ message: 'Failed to fetch users', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = async (userId: number) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      setSnackbar({ message: 'User deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ message: 'Failed to delete user', severity: 'error' });
    }
  };

  const handleCreate = async (formData: UserForm) => {
    try {
      const response = await axios.post('https://reqres.in/api/users', formData);
      const newUser = { ...response.data, id: Date.now() }; // Generate temporary ID
      setUsers([...users, newUser]);
      setOpenCreate(false);
      setSnackbar({ message: 'User created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ message: 'Failed to create user', severity: 'error' });
    }
  };

  const handleUpdate = async (userId: number, formData: UserForm) => {
    try {
      await axios.put(`https://reqres.in/api/users/${userId}`, formData);
      setUsers(users.map(user => user.id === userId ? { ...user, ...formData } : user));
      setEditUser(null);
      setSnackbar({ message: 'User updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ message: 'Failed to update user', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreate(true)}
          data-testid="create-user-button"
        >
          Create User
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setEditUser(user)} data-testid={`edit-user-${user.id}`}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      data-testid={`delete-user-${user.id}`}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        </TableContainer>
      )}

      {/* Create User Dialog */}
      <UserFormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
        title="Create New User"
      />

      {/* Edit User Dialog */}
      <UserFormDialog
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        onSubmit={(formData) => editUser && handleUpdate(editUser.id, formData)}
        title="Edit User"
        initialData={editUser}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
      >
        <Alert
          severity={snackbar?.severity}
          sx={{ width: '100%' }}
          onClose={() => setSnackbar(null)}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// User Form Dialog Component
interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: UserForm) => void;
  title: string;
  initialData?: User | null;
}

const UserFormDialog = ({ open, onClose, onSubmit, title, initialData }: UserFormDialogProps) => {
  const [formData, setFormData] = useState<UserForm>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || ''
  });

  const [errors, setErrors] = useState<Partial<UserForm>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Partial<UserForm> = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="First Name"
          fullWidth
          margin="normal"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="normal"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          error={!!errors.last_name}
          helperText={errors.last_name}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserTable;