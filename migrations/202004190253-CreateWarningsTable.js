module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Warnings', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            userId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            editId: {
                allowNull: true,
                type: Sequelize.UUID,
                references: {
                    model: 'Edits',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Warnings');
    }
};