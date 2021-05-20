module.exports = (sequelize, DataTypes) => {
    var Edit = sequelize.define('Edit', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        newContent: {
            allowNull: true,
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        updatedAt: false
    });

    Edit.associate = models => {
        Edit.belongsTo(models.User, {
            onDelete: 'NO ACTION',
            foreignKey: {
                fieldName: 'userId',
                type: DataTypes.UUID,
                allowNull: false
            }
        });
        Edit.belongsTo(models.Topic, {
            onDelete: 'SET NULL',
            foreignKey: {
                fieldName: 'topicId',
                type: DataTypes.UUID,
                allowNull: true
            }
        });
    };

    return Edit;
};