require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./src/middlewares/errorMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Audio files range handling fix
app.use((req, res, next) => {
    if (req.url.endsWith('.mp3')) {
        delete req.headers.range;
    }
    next();
});

//Static files 
app.use(express.static(path.join(__dirname, 'public'), {
    acceptRanges: false, 
    etag: false
}));

// 2. API Routes
app.use('/api', authRoutes);         
app.use('/api/game', gameRoutes);   

// 3. Error Handler
app.use(errorHandler); 


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Mission Control: http://localhost:${PORT}`);
});