const bcrypt = require('bcryptjs');
const { Player } = require('../models');

// Register
exports.register = async (req, res) => {
    const { username, password, faction } = req.body;

    if (!username || !password || !faction) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existingPlayer = await Player.findOne({ where: { username } });
        if (existingPlayer) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newPlayer = await Player.create({
            username,
            password: hashedPassword,
            faction,
        });

        req.session.playerId = newPlayer.player_id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const player = await Player.findOne({ where: { username } });
        if (!player) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, player.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        req.session.playerId = player.player_id;
        res.redirect('/dashboard'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Logout failed.');
        }
        res.redirect('/');
    });
};