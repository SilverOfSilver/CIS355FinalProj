const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Player = require('./Player')(sequelize, Sequelize.DataTypes);
const Tile = require('./Tile')(sequelize, Sequelize.DataTypes);
const Unit = require('./Unit')(sequelize, Sequelize.DataTypes);
const Building = require('./Building')(sequelize, Sequelize.DataTypes);
const ActionQueue = require('./ActionQueue')(sequelize, Sequelize.DataTypes);


Player.hasMany(Unit, { foreignKey: 'player_id' });
Player.hasMany(Building, { foreignKey: 'player_id' });
Player.hasMany(ActionQueue, { foreignKey: 'player_id' });
Player.hasMany(Tile, { foreignKey: 'owner_id' });

Unit.belongsTo(Player, { foreignKey: 'player_id' });
Building.belongsTo(Player, { foreignKey: 'player_id' });
ActionQueue.belongsTo(Player, { foreignKey: 'player_id' });
Tile.belongsTo(Player, { foreignKey: 'owner_id' });

module.exports = {
    sequelize,
    Player,
    Tile,
    Unit,
    Building,
    ActionQueue,
};