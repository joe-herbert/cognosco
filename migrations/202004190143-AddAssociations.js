module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn(
                    'Edits',
                    'userId',
                    {
                        type: Sequelize.UUID,
                        allowNull: false,
                        references: {
                            model: 'Users',
                            key: 'id'
                        },
                        onUpdate: 'CASCADE',
                        onDelete: 'NO ACTION'
                    }, {
                        transaction: t
                    }
                ),
                queryInterface.addColumn(
                    'Edits',
                    'topicId', {
                        type: Sequelize.UUID,
                        allowNull: true,
                        references: {
                            model: 'Topics',
                            key: 'id'
                        },
                        onUpdate: 'CASCADE',
                        onDelete: 'SET NULL'
                    }, {
                        transaction: t
                    }
                )
            ]);
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.removeColumn('Edits', 'userId', {
                    transaction: t
                }),
                queryInterface.removeColumn('Edits', 'topicId', {
                    transaction: t
                })
            ]);
        });
    }
};