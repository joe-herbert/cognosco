module.exports = (sequelize, DataTypes) => {
    var Language = sequelize.define('Language', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        dbName: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        title: {
            allowNull: true,
            type: DataTypes.STRING
        },
        baseColumn: {
            allowNull: false,
            type: DataTypes.STRING
        },
        primaryColumn: {
            allowNull: false,
            type: DataTypes.STRING
        },
        secondaryColumn: {
            allowNull: true,
            type: DataTypes.STRING
        },
        voice: {
            allowNull: false,
            type: DataTypes.STRING,
            defaultValue: "UK English Female"
        }
    });

    return Language;
};