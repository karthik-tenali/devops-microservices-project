import React, { useState } from 'react';
import {
  AppBar, Tabs, Tab, Box, Snackbar, Alert, Typography, Container
} from '@mui/material';
import UserList from './components/UserList';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" textAlign="center" gutterBottom>
        Microservices Management Dashboard
      </Typography>

      <AppBar position="static" sx={{ borderRadius: 1 }}>
        <Tabs
          value={tabIndex}
          onChange={(e, idx) => setTabIndex(idx)}
          textColor="inherit"
          indicatorColor="secondary"
          centered
          sx={{ px: 2 }}
        >
          <Tab label="Users" />
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>
      </AppBar>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <UserList showSnackbar={showSnackbar} />}
        {tabIndex === 1 && <ProductList showSnackbar={showSnackbar} />}
        {tabIndex === 2 && <OrderList showSnackbar={showSnackbar} />}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={closeSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;

