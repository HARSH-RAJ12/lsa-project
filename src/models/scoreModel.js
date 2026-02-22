const Score = require('../models/scoreModel'); 

exports.saveScore = async (req, res) => {
    try {
        const { score, level, h, l, w, target } = req.body;

       
        const serverCalc = 2 * parseInt(h) * (parseInt(l) + parseInt(w));
        
        if (serverCalc !== parseInt(target)) {
            return res.status(400).json({ error: "Security Alert: Calculation Mismatch!" });
        }

        await Score.save(req.user.username, score, level, req.user.id);
        
        res.json({ message: "Data Verified and Saved!" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Database Sync Error" }); 
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const results = await Score.getTopScores();
        res.json(results);
    } catch (e) { 
        res.status(500).json({ error: "Offline" }); 
    }
};