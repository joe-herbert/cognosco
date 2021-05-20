const columnAndTypes = [{
    name: 'languageTable',
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
                    'Topics',
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
                    'Topics',
                    c.name
                );
            })
        );
    }
};