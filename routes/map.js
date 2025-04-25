const express = require('express');
const { Tile } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.playerId) {
        return res.redirect('/auth/login');
    }

    try {
        const tiles = await Tile.findAll({ limit: 100 });
        //console.log('Tiles passed to template:', tiles.map(tile => tile.toJSON()))
        res.render('map', { tiles: tiles.map(tile => tile.toJSON()) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;