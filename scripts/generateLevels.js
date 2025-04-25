const { Tile } = require('../models');
const sequelize = require('../config/database');

const generateAggregatedLevels = async () => {
    try {
        const highDetailTiles = await Tile.findAll({ where: { level_of_detail: 'high' } });

        const mediumDetailTiles = {};
        const lowDetailTiles = {};

        // Group tiles into 4x4 for medium and 16x16 for low
        highDetailTiles.forEach(tile => {
            const x = Math.floor((tile.tile_id % 1024) / 4); // Group into 4x4 for medium
            const y = Math.floor(tile.tile_id / 1024 / 4);
            const mediumKey = `${x},${y}`;

            const xLow = Math.floor(x / 4); // Group into 16x16 for low
            const yLow = Math.floor(y / 4);
            const lowKey = `${xLow},${yLow}`;

            // Aggregate for medium detail
            if (!mediumDetailTiles[mediumKey]) {
                mediumDetailTiles[mediumKey] = { terrain: {}, resources: {}, count: 0 };
            }
            mediumDetailTiles[mediumKey].terrain[tile.terrain_type] =
                (mediumDetailTiles[mediumKey].terrain[tile.terrain_type] || 0) + 1;
            mediumDetailTiles[mediumKey].count++;

            // Aggregate resources
            const resources = JSON.parse(tile.resources);
            for (const [key, value] of Object.entries(resources)) {
                mediumDetailTiles[mediumKey].resources[key] =
                    (mediumDetailTiles[mediumKey].resources[key] || 0) + value;
            }

            // Aggregate for low detail
            if (!lowDetailTiles[lowKey]) {
                lowDetailTiles[lowKey] = { terrain: {}, resources: {}, count: 0 };
            }
            lowDetailTiles[lowKey].terrain[tile.terrain_type] =
                (lowDetailTiles[lowKey].terrain[tile.terrain_type] || 0) + 1;
            lowDetailTiles[lowKey].count++;

            // Aggregate resources
            for (const [key, value] of Object.entries(resources)) {
                lowDetailTiles[lowKey].resources[key] =
                    (lowDetailTiles[lowKey].resources[key] || 0) + value;
            }
        });

        // Save medium detail tiles
        for (const [key, data] of Object.entries(mediumDetailTiles)) {
            const [x, y] = key.split(',').map(Number);
            const dominantTerrain = Object.keys(data.terrain).reduce((a, b) =>
                data.terrain[a] > data.terrain[b] ? a : b
            );
            const averageResources = {};
            for (const [key, value] of Object.entries(data.resources)) {
                averageResources[key] = Math.floor(value / data.count);
            }
            const mediumTileId = 1024 * 1024 + y * 256 + x; // Ensure unique ID for medium level
            await Tile.create({
                tile_id: mediumTileId,
                terrain_type: dominantTerrain,
                resources: JSON.stringify(averageResources),
                level_of_detail: 'medium',
            });
        }

        // Save low detail tiles
        for (const [key, data] of Object.entries(lowDetailTiles)) {
            const [x, y] = key.split(',').map(Number);
            const dominantTerrain = Object.keys(data.terrain).reduce((a, b) =>
                data.terrain[a] > data.terrain[b] ? a : b
            );
            const averageResources = {};
            for (const [key, value] of Object.entries(data.resources)) {
                averageResources[key] = Math.floor(value / data.count);
            }
            const lowTileId = 1024 * 1024 * 2 + y * 64 + x; // Ensure unique ID for low level
            await Tile.create({
                tile_id: lowTileId,
                terrain_type: dominantTerrain,
                resources: JSON.stringify(averageResources),
                level_of_detail: 'low',
            });
        }

        console.log('Aggregated levels generated successfully!');
    } catch (error) {
        console.error('Error generating aggregated levels:', error);
    } finally {
        process.exit();
    }
};

generateAggregatedLevels();