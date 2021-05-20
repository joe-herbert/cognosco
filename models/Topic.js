module.exports = (sequelize, DataTypes) => {
    var Topic = sequelize.define('Topic', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING
        },
        content: {
            allowNull: true,
            type: DataTypes.TEXT
        },
        parentId: {
            allowNull: true,
            type: DataTypes.UUID
        },
        directory: {
            allowNull: false,
            type: DataTypes.STRING
        },
        titleUrl: {
            allowNull: false,
            type: DataTypes.STRING
        },
        languageTable: {
            allowNull: true,
            type: DataTypes.STRING
        }
    });

    Topic.addHook('afterCreate', (topic, options) => {
        topic.titleUrl = getUrlForTitle(topic.title);
        let id = topic.parentId; //set starting id
        let dir = "";
        models.Topic.findAll().then(topicsDB => {
            while (id) {
                let result;
                for (let record of topicsDB) {
                    if (record.id === id) {
                        result = record;
                        break;
                    }
                }
                dir = getUrlForTitle(result.title) + "/" + dir;
                id = result.parentId;
            }
        });
        topic.directory = "/learn/" + dir;
    });

    Topic.addHook('afterUpdate', (topic, options) => {
        topic.titleUrl = getUrlForTitle(topic.title);
    });

    return Topic;
};

function getUrlForTitle(str) {
    return str.replace(/\s/g, '-').toLowerCase();
}