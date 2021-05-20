module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            'Topics',
            'content', {
                allowNull: true,
                type: Sequelize.TEXT,
                defaultValue: null
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            'Topics',
            'content', {
                allowNull: false,
                type: Sequelize.TEXT,
                defaultValue: "Coming soon!"
            }
        );
    }
};