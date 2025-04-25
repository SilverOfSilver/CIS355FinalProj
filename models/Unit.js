module.exports = (sequelize, DataTypes) => {
    const Unit = sequelize.define('Unit', {
        unit_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        player_id: { type: DataTypes.INTEGER, allowNull: false },
        position_x: { type: DataTypes.INTEGER, allowNull: false },
        position_y: { type: DataTypes.INTEGER, allowNull: false },
        unit_type: { type: DataTypes.STRING, allowNull: false },
        HP: { type: DataTypes.INTEGER, defaultValue: 100 },
        status: { type: DataTypes.JSON, defaultValue: {} },
    });
    Unit.associate = (models) => {
        Unit.belongsTo(models.Player, { foreignKey: 'player_id' });
    };
    return Unit;
};