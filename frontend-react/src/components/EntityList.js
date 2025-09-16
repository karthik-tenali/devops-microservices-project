import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, Dialog, DialogActions,
  DialogContent, DialogTitle, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Typography
} from '@mui/material';

function EntityList({ apiBaseUrl, fields, title, showSnackbar }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Initialize empty form based on fields
  const emptyForm = fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${apiBaseUrl}`);
      setItems(resp.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [apiBaseUrl]);

  const handleOpen = (item = null) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
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

  const handleSubmit = async () => {
    for (const f of fields) {
      if (!form[f.name]) {
        setError(`${f.label} is required`);
        return;
      }
    }

    try {
      if (editingItem) {
        await axios.put(`${apiBaseUrl}/${form[fields[0].name]}`, form);
        showSnackbar(`${title} updated successfully`, "success");
      } else {
        await axios.post(apiBaseUrl, form);
        showSnackbar(`${title} created successfully`, "success");
      }
      fetchItems();
      handleClose();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save';
      setError(msg);
      showSnackbar(msg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      showSnackbar(`${title} deleted successfully`, "success");
      fetchItems();
    } catch {
      showSnackbar(`Failed to delete ${title.toLowerCase()}`, "error");
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">{title} Management</Typography>
          <Button variant="contained" onClick={() => handleOpen()}>
            Add New {title}
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
                {fields.map((f) => (
                  <TableCell key={f.name}>{f.label}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item[fields[0].name]}>
                  {fields.map((f) => (
                    <TableCell key={f.name}>{item[f.name]}</TableCell>
                  ))}
                  <TableCell>
                    <Button size="small" onClick={() => handleOpen(item)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(item[fields[0].name])}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!items.length && (
                <TableRow>
                  <TableCell colSpan={fields.length + 1} align="center">No data</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingItem ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
          <DialogContent>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            {fields.map((f) => (
              <TextField
                key={f.name}
                margin="dense"
                label={f.label}
                name={f.name}
                type={f.type || 'text'}
                fullWidth
                disabled={editingItem && f.name === fields[0].name}
                value={form[f.name]}
                onChange={handleChange}
                inputProps={f.step ? { step: f.step } : {}}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">{editingItem ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default EntityList;

