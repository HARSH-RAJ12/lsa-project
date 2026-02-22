const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/save-score', authMiddleware, gameController.saveScore);
router.get('/leaderboard', gameController.getLeaderboard);

module.exports = router;