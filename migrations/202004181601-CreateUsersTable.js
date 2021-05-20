module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            firstname: {
                allowNull: true,
                type: Sequelize.STRING
            },
            surname: {
                allowNull: true,
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING
            },
            password: {
                allowNull: true,
                type: Sequelize.STRING
            },
            dob: {
                allowNull: true,
                type: Sequelize.DATEONLY
            },
            isAdmin: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        return queryInterface.dropTable('Users');
    }
};