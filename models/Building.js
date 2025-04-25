module.exports = (sequelize, DataTypes) => {
    const Building = sequelize.define('Building', {
        building_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        player_id: { type: DataTypes.INTEGER, allowNull: false },
        position_x: { type: DataTypes.INTEGER, allowNull: false },
        position_y: { type: DataTypes.INTEGER, allowNull: false },
        size_x: { type: DataTypes.INTEGER, allowNull: false },
        size_y: { type: DataTypes.INTEGER, allowNull: false },
        building_type: { type: DataTypes.STRING, allowNull: false },
        HP: { type: DataTypes.INTEGER, defaultValue: 100 },
    });
    Building.associate = (models) => {
        Building.belongsTo(models.Player, { foreignKey: 'player_id' });
    };
    return Building;
};