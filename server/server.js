// server/server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend for testing
app.use(express.static(path.join(__dirname, '../public')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Serve /admin/login.html when user visits /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/login.html'));
});

// --- PRODUCT API ---
app.get('/api/products', (req, res) => {
  const data = fs.readFileSync('./server/product.json');
  res.json(JSON.parse(data));
});

app.post('/api/products', (req, res) => {
  const products = req.body;
  fs.writeFileSync('./server/product.json', JSON.stringify(products, null, 2));
  fs.writeFileSync('./public/product.json', JSON.stringify(products, null, 2)); // Sync
  res.json({ message: 'Products updated' });
});

// --- ORDER API ---
app.post('/api/order', (req, res) => {
  const order = req.body;
  const orders = JSON.parse(fs.readFileSync('./server/orders.json', 'utf-8'));
  orders.push(order);
  fs.writeFileSync('./server/orders.json', JSON.stringify(orders, null, 2));

  // Send invoice
  sendInvoiceEmail(order);
  res.json({ message: 'Order placed and email sent' });
});

// --- Simple Admin Login API ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./server/users.json'));
  const user = users.find(u => u.username === username && u.password === password);
  if (user) res.json({ success: true });
  else res.status(401).json({ success: false, message: 'Invalid credentials' });
});

function sendInvoiceEmail(order) {
  const html = `
    <h2>Thank you for your order!</h2>
    <p>Order details:</p>
    <ul>${order.items.map(i => `<li>${i.name} × ${i.qty} = ₹${i.price * i.qty}</li>`).join('')}</ul>
    <p><strong>Total: ₹${order.total}</strong></p>
  `;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // .env
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: 'Your Belavitta Perfume Order',
    html,
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
