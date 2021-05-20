module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Mandarin', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            english: {
                allowNull: false,
                type: Sequelize.STRING
            },
            altEnglish: {
                allowNull: true,
                type: Sequelize.STRING
            },
            pinyin: {
                allowNull: false,
                type: Sequelize.STRING
            },
            mandarin: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Mandarin');
    }
};