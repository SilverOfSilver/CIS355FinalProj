// Had ChatGPT generate this because my script was slow and ran out of memory trying to insert 4096x4096 tiles into the database.
// I fiure its not part of the main functionality of the program, just for setting up the DB.
// Who wouldve known I cant just generate 16 million tiles at once and let sequelize handle it.
// reduced it to 512x512 for testing. 
// If I developpe this further in the future, Ill go back to 4096x4096 after implementing a better db structure.


const { Tile } = require('../models');
const sequelize = require('../config/database');

const generateMap = async () => {
    const terrainTypes = ['plains', 'forest', 'mountains', 'desert', 'water'];
    const resources = ['wood', 'stone', 'food', 'gold'];
    const batchSize = 8192; // Number of tiles to process in each batch
    const mapSize = 512; // Map size (512x512 tiles)

    try {
        await sequelize.sync({ force: true });

        for (let xStart = 0; xStart < mapSize; xStart += 16) {
            const tiles = [];
            const xEnd = Math.min(xStart + 16, mapSize);

            console.log(`Generating and inserting tiles for rows ${xStart} to ${xEnd - 1}`);

            for (let x = xStart; x < xEnd; x++) {
                for (let y = 0; y < mapSize; y++) {
                    tiles.push({
                        tile_id: y * mapSize + x,
                        terrain_type: terrainTypes[Math.floor(Math.random() * terrainTypes.length)],
                        resources: JSON.stringify({
                            [resources[Math.floor(Math.random() * resources.length)]]: Math.floor(Math.random() * 100),
                        }),
                    });

                    if (tiles.length >= batchSize) {
                        await Tile.bulkCreate(tiles);
                        tiles.length = 0;
                    }
                }
            }

            if (tiles.length > 0) {
                await Tile.bulkCreate(tiles);
            }
        }

        console.log('Map generated successfully!');
    } catch (error) {
        console.error('Error generating map:', error);
    } finally {
        process.exit();
    }
};

generateMap();