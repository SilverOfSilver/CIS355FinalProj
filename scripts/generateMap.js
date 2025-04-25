const { Tile } = require('../models');
const sequelize = require('../config/database');

const generateMap = async () => {
    const terrainTypes = ['plains', 'forest', 'mountains', 'desert', 'water'];
    const resources = ['wood', 'stone', 'food', 'gold'];

    try {
        await sequelize.sync({ force: true });

        const tiles = [];
        for (let x = 0; x < 1024; x++) {
            for (let y = 0; y < 1024; y++) {
                tiles.push({
                    tile_id: y * 1024 + x,
                    terrain_type: terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
                    resources: JSON.stringify({
                        [resources[Math.floor(Math.random() * resources.length)]]: Math.floor(Math.random() * 100),
                    }),
                });
                console.log(`Generating tile at (${x}, ${y}) with terrain type: ${tiles[tiles.length - 1].terrain_type}`);
            }
        }
        console.log('Tiles generated, inserting into database...');
        await Tile.bulkCreate(tiles);
        console.log('Map generated successfully!');
    } catch (error) {
        console.error('Error generating map:', error);
    } finally {
        process.exit();
    }
};

generateMap();