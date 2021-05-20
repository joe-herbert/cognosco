module.exports = (sequelize, DataTypes) => {
    var Warning = sequelize.define('Warning', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        timestamps: true,
        updatedAt: false
    });

    Warning.associate = models => {
        Warning.belongsTo(models.User, {
            onDelete: 'CASCADE',
            foreignKey: {
                fieldName: 'userId',
                type: DataTypes.UUID,
                allowNull: false
            }
        });
        Warning.belongsTo(models.Edit, {
            onDelete: 'SET NULL',
            foreignKey: {
                fieldName: 'editId',
                type: DataTypes.UUID,
                allowNull: true
            }
        });
    };

    return Warning;
};