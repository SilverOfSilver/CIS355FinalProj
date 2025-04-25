module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define('Player', {
        player_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        faction: { type: DataTypes.STRING, allowNull: false },
        resources: { type: DataTypes.JSON, defaultValue: { food: 0, wood: 0, stone: 0 } },
    });
    return Player;
};