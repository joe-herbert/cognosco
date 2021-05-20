const columnAndTypes = [{
    name: 'directory',
    type: (Sequelize) => {
        return {
            type: Sequelize.STRING,
            allowNull: false
        };
    }
},
{
    name: 'titleUrl',
    type: (Sequelize) => {
        return {
            type: Sequelize.STRING,
            allowNull: false
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