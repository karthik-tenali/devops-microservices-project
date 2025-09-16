//import React from 'react';
//import EntityList from './EntityList';

//const orderFields = [
//  { name: 'id', label: 'ID', type: 'number' },
//  { name: 'userId', label: 'User ID', type: 'number' },
//  { name: 'productId', label: 'Product ID', type: 'number' },
//  { name: 'status', label: 'Status' },
//];

//function OrderList(props) {
//  return <EntityList {...props} apiBaseUrl="http://localhost:4000/orders" fields={orderFields} title="Order" />;
//}

//export default OrderList;
//
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, Dialog, DialogActions,
  DialogContent, DialogTitle, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Typography, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';

function OrderList({ showSnackbar }) {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const emptyForm = { id: '', userId: '', productId: '', status: '' };
  const [form, setForm] = useState(emptyForm);

  // Fetch users, products, orders on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:8000/users'),
          axios.get('http://localhost:3001/products'),
          axios.get('http://localhost:4000/orders'),
        ]);
        setUsers(usersRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Lookup maps for names
  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {});

  const productMap = products.reduce((acc, product) => {
    acc[product.id] = product.name;
    return acc;
  }, {});

  const handleOpen = (order = null) => {
    if (order) {
      setEditingOrder(order);
      setForm({
        id: order.id,
        userId: order.userId,
        productId: order.productId,
        status: order.status,
      });
    } else {
      setEditingOrder(null);
      setForm(emptyForm);
    }
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/orders');
      setOrders(res.data);
      setError(null);
    } catch {
      setError('Failed to fetch orders');
    }
  };

  const handleSubmit = async () => {
    if (!form.id || !form.userId || !form.productId || !form.status) {
      setError('All fields are required');
      return;
    }
    try {
      if (editingOrder) {
        await axios.put(`http://localhost:4000/orders/${form.id}`, {
          id: parseInt(form.id),
          userId: parseInt(form.userId),
          productId: parseInt(form.productId),
          status: form.status,
        });
        showSnackbar('Order updated successfully', 'success');
      } else {
        await axios.post('http://localhost:4000/orders', {
          id: parseInt(form.id),
          userId: parseInt(form.userId),
          productId: parseInt(form.productId),
          status: form.status,
        });
        showSnackbar('Order created successfully', 'success');
      }
      await fetchOrders();
      handleClose();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save order';
      setError(msg);
      showSnackbar(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:4000/orders/${id}`);
      showSnackbar('Order deleted successfully', 'success');
      fetchOrders();
    } catch {
      showSnackbar('Failed to delete order', 'error');
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Order Management</Typography>
          <Button variant="contained" onClick={() => handleOpen()}>
            Add New Order
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{userMap[order.userId] || order.userId}</TableCell>
                  <TableCell>{productMap[order.productId] || order.productId}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleOpen(order)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(order.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
              {!orders.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No orders</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingOrder ? 'Edit Order' : 'Add New Order'}</DialogTitle>
          <DialogContent>
            {error && <Typography color="error" mb={2}>{error}</Typography>}

            <TextField
              autoFocus
              margin="dense"
              label="ID"
              name="id"
              fullWidth
              disabled={!!editingOrder}
              value={form.id}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="user-select-label">User</InputLabel>
              <Select
                labelId="user-select-label"
                label="User"
                name="userId"
                value={form.userId}
                onChange={handleChange}
              >
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="product-select-label">Product</InputLabel>
              <Select
                labelId="product-select-label"
                label="Product"
                name="productId"
                value={form.productId}
                onChange={handleChange}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Status"
              name="status"
              fullWidth
              value={form.status}
              onChange={handleChange}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingOrder ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default OrderList;


