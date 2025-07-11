const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./config/database');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const resourceRoutes = require('./routes/resourceRoute');
const userRoutes = require('./routes/userRoute');
app.use('/api', resourceRoutes);
app.use('/api', userRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});