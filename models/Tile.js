module.exports = (sequelize, DataTypes) => {
    const Tile = sequelize.define('Tile', {
        tile_id: { type: DataTypes.INTEGER, primaryKey: true },
        terrain_type: { type: DataTypes.STRING, allowNull: false },
        resources: { type: DataTypes.JSON, defaultValue: {} },
        owner_id: { type: DataTypes.INTEGER, allowNull: true },
    });
    Tile.associate = (models) => {
        Tile.belongsTo(models.Player, { foreignKey: 'owner_id' });
    };
    return Tile;
};