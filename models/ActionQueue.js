module.exports = (sequelize, DataTypes) => {
    const ActionQueue = sequelize.define('ActionQueue', {
        action_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        player_id: { type: DataTypes.INTEGER, allowNull: false },
        action_type: { type: DataTypes.STRING, allowNull: false },
        target: { type: DataTypes.JSON, allowNull: false },
        parameters: { type: DataTypes.JSON, allowNull: true },
        executed: { type: DataTypes.BOOLEAN, defaultValue: false },
    });
    ActionQueue.associate = (models) => {
        ActionQueue.belongsTo(models.Player, { foreignKey: 'player_id' });
    };
    return ActionQueue;
};