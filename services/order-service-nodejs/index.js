const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// In-memory order store
const orders = {};

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Order Service is running' });
});

// Get all orders
app.get('/orders', (req, res) => {
  res.json(Object.values(orders));
});

// Get order by ID
app.get('/orders/:id', (req, res) => {
  const order = orders[req.params.id];
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

// Create a new order
app.post('/orders', (req, res) => {
  const { id, userId, productId, status } = req.body;
  if (orders[id]) {
    res.status(400).json({ error: 'Order ID already exists' });
    return;
  }
  orders[id] = { id, userId, productId, status };
  res.json(orders[id]);
});

// Update an order
app.put('/orders/:id', (req, res) => {
  const { id, userId, productId, status } = req.body;
  if (req.params.id !== id.toString()) {
    res.status(400).json({ error: 'Order ID mismatch' });
    return;
  }
  if (!orders[id]) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  orders[id] = { id, userId, productId, status };
  res.json(orders[id]);
});

// Delete an order
app.delete('/orders/:id', (req, res) => {
  if (!orders[req.params.id]) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  delete orders[req.params.id];
  res.json({ message: 'Order deleted' });
});

// Start server
app.listen(port, () => {
  console.log(`Order service running on port ${port}`);
});

