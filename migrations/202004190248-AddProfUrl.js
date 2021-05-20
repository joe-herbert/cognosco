const columnAndTypes = [{
    name: 'profUrl',
    type: (Sequelize) => {
        return {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        };
    }
}];

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            columnAndTypes.map(c => {
                return queryInterface.addColumn(
                    'Users',
                    c.name,
                    c.type(Sequelize)
                );
            })
        );
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all(
            columnAndTypes.map(c => {
                return queryInterface.removeColumn(
                    'Users',
                    c.name
                );
            })
        );
    }
};