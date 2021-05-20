module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Topics', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            content: {
                allowNull: false,
                type: Sequelize.TEXT,
                defaultValue: "Coming soon!"
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            parentId: {
                allowNull: true,
                type: Sequelize.UUID
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Topics');
    }
};