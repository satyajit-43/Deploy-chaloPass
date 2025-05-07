// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const path = require("path")
// const cors = require('cors');

// const app = express();


// // Connect to database
// connectDB();



// // Middleware
// app.use(express.json());



// const _dirname = path.dirname("")
// const buildpath = path.join(_dirname,"../client/dist")
// app.use(express.static(buildpath));


// // Enable CORS
// app.use(cors({
//     origin: '*', // Your frontend origin
//     credentials: true // If you're using cookies/sessions
//   }));


// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/wallet', require('./routes/walletRoutes'));
// app.use('/api/users', require('./routes/authRoutes'));
// app.use('/api/qr', require('./routes/qrRoutes'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => 
//   console.log(`Server running on port ${PORT} `)
// );




require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// Serve frontend
const _dirname = path.resolve();
const buildpath = path.join(_dirname, 'client', 'dist');
app.use(express.static(buildpath));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));

// Catch-all to support React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(buildpath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
