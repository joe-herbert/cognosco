module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            'Mandarin',
            'id', {
                allowNull: false,
                type: Sequelize.INTEGER,
                autoIncrement: true
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            'Mandarin',
            'id', {
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            }
        );
    }
};