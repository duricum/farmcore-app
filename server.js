const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5500' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect all Routes (APIs)
app.use('/api/auth',        require('./routes/auth'));
//app.use('/api/livestock',   require('./routes/livestock'));
//app.use('/api/marketplace', require('./routes/marketplace'));
//app.use('/api/orders',      require('./routes/orders'));
//app.use('/api/investments', require('./routes/investments'));
//app.use('/api/crm',         require('./routes/crm'));
//app.use('/api/finance',     require('./routes/finance'));
//app.use('/api/admin',       require('./routes/admin'));

// Health check - Visit this URL to confirm server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'FarmCore', version: '1.0.0' , timestamp: new Date().toISOString()});
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ FarmCore server running on port ${PORT}`);
  console.log(`🌱 API: http://localhost:${PORT}/api`);
});