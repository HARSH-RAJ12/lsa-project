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


app.use((req, res, next) => {
    if (req.url.endsWith('.mp3')) {
        delete req.headers.range;
    }
    next();
});


app.use('/api', authRoutes);         
app.use('/api/game', gameRoutes);   


app.use(express.static(path.join(__dirname, 'public')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. Error Handler
app.use(errorHandler); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Mission Control: http://localhost:${PORT}`);
});