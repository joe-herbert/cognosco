module.exports = (sequelize, DataTypes) => {
    var Mandarin = sequelize.define('Mandarin', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        english: {
            allowNull: false,
            type: DataTypes.STRING
        },
        altEnglish: {
            allowNull: true,
            type: DataTypes.STRING
        },
        pinyin: {
            allowNull: false,
            type: DataTypes.STRING
        },
        mandarin: {
            allowNull: false,
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        updatedAt: false
    });

    return Mandarin;
};