module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        firstname: {
            allowNull: true,
            type: DataTypes.STRING
        },
        surname: {
            allowNull: true,
            type: DataTypes.STRING
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING
        },
        password: {
            allowNull: true,
            type: DataTypes.STRING
        },
        dob: {
            allowNull: true,
            type: DataTypes.DATEONLY
        },
        isAdmin: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
};