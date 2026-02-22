const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create(username, hashedPassword);
        res.json({ message: "Agent Registered Successfully!" });
    } catch (e) { 
        res.status(400).json({ error: "Username already exists!" }); 
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) return res.status(401).json({ error: "Agent not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid Credentials!" });

        const token = jwt.sign(
            { id: user.id, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );
        res.json({ token, username: user.username });
    } catch (e) { 
        res.status(500).json({ error: "Server Error" }); 
    }
};