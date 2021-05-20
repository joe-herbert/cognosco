const columnAndTypes = [{
    name: 'title',
    type: (Sequelize) => {
        return {
            type: Sequelize.STRING,
            allowNull: true
        };
    }
}];

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all(
            columnAndTypes.map(c => {
                return queryInterface.addColumn(
                    'Languages',
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
                    'Languages',
                    c.name
                );
            })
        );
    }
};