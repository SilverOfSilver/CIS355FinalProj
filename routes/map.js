const express = require('express');
const { Tile, Unit, Building, ActionQueue } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.playerId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { x = 0, y = 0, limit = 256 } = req.query;

    try {
        const gridSize = Math.sqrt(parseInt(limit, 10));
        const tiles = [];

        for (let row = 0; row < gridSize; row++) {
            const fetchedTiles = await Tile.findAll({
                limit: Math.ceil(gridSize),
                offset: (parseInt(y, 10) + row) * 512 + parseInt(x, 10),
            });
            tiles.push(...fetchedTiles.map(tile => tile.toJSON()));
        }
        res.json(tiles);
    } catch (error) {
        console.error('Error fetching tiles:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/details', async (req, res) => {
    const { tileId } = req.query;

    if (!tileId) {
        return res.status(400).json({ error: 'Tile ID is required' });
    }

    try {
        const units = await Unit.findAll({ where: { position_x: tileId % 512, position_y: Math.floor(tileId / 512) } });
        const buildings = await Building.findAll({ where: { position_x: tileId % 512, position_y: Math.floor(tileId / 512) } });

        res.json({ units, buildings });
    } catch (error) {
        console.error('Error fetching tile details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/queue-action', async (req, res) => {
    const { tileId, action_type, target } = req.body;

    if (!req.session.playerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!tileId || !action_type || !target) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        await ActionQueue.create({
            player_id: req.session.playerId,
            action_type,
            target: { tileId, target },
            parameters: { target },
        });

        res.status(200).json({ message: 'Action queued successfully.' });
    } catch (error) {
        console.error('Error queuing action:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get('/action-queue', async (req, res) => {
    if (!req.session.playerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const actions = await ActionQueue.findAll({ where: { player_id: req.session.playerId, executed: false } });
        res.json(actions);
    } catch (error) {
        console.error('Error fetching action queue:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/process-actions', async (req, res) => {
    if (!req.session.playerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const actions = await ActionQueue.findAll({ where: { player_id: req.session.playerId, executed: false } });

        for (const action of actions) {
            const { action_type, target } = action;
            const tileId = target.tileId;
            const position_x = tileId % 512;
            const position_y = Math.floor(tileId / 512);

            if (action_type === 'build_unit') {
                await Unit.create({
                    player_id: req.session.playerId,
                    position_x,
                    position_y,
                    unit_type: target.target,
                    HP: 100,
                    status: {},
                });
            } else if (action_type === 'build_building') {
                await Building.create({
                    player_id: req.session.playerId,
                    position_x,
                    position_y,
                    size_x: 1,
                    size_y: 1,
                    building_type: target.target,
                    HP: 100,
                });
            }
            action.executed = true;
            await action.save();
        }

        res.status(200).json({ message: 'Actions processed successfully.' });
    } catch (error) {
        console.error('Error processing actions:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


router.delete('/action-queue/:id', async (req, res) => {
    if (!req.session.playerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const action = await ActionQueue.findOne({ where: { action_id: req.params.id, player_id: req.session.playerId } });
        if (!action) {
            return res.status(404).json({ message: 'Action not found.' });
        }

        await action.destroy();
        res.status(200).json({ message: 'Action deleted successfully.' });
    } catch (error) {
        console.error('Error deleting action:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


router.put('/action-queue/:id', async (req, res) => {
    if (!req.session.playerId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { action_type, target } = req.body;

    if (!action_type || !target) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const action = await ActionQueue.findOne({ where: { action_id: req.params.id, player_id: req.session.playerId } });
        if (!action) {
            return res.status(404).json({ message: 'Action not found.' });
        }

        action.action_type = action_type;
        action.target = target;
        await action.save();

        res.status(200).json({ message: 'Action updated successfully.' });
    } catch (error) {
        console.error('Error updating action:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;