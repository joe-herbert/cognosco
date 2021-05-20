module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Languages', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            dbName: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            baseColumn: {
                allowNull: false,
                type: Sequelize.STRING
            },
            primaryColumn: {
                allowNull: false,
                type: Sequelize.STRING
            },
            secondaryColumn: {
                allowNull: true,
                type: Sequelize.STRING
            },
            voice: {
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue: "UK English Female"
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Languages');
    }
};