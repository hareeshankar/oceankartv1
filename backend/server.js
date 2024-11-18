const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('OceanMart backend is running!');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productsRoutes = require('./routes/products'); 
// Use the products route
app.use('/api/products', productsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
