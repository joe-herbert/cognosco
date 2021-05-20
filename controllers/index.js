const models = require('../models');
const createError = require('http-errors');

const {
    isEmpty
} = require('lodash');

const {
    validateTopic
} = require('../validators/newTopic');

const {
    validateWord
} = require('../validators/newWord');

const {
    validateLanguage
} = require('../validators/newLanguage');

exports.show_index = function(req, res, next) {
    res.render('index', {
        user: req.user
    });
};

exports.show_topic = function(req, res, next) {
    get_topic_for_render(req, res, next);
    // for (let wordIndex in words) {
    //     setTimeout(() => {
    //         let word = words[wordIndex];
    //         req.body = {
    //             english: word.english,
    //             pinyin: word.pinyin,
    //             mandarin: word.mandarin,
    //         };
    //         if (word.altEnglish) req.body.altEnglish = word.altEnglish;
    //         models.Mandarin.create(req.body).then(result => {
    //             console.log("Success: " + word.english);
    //         }).catch(err => {
    //             console.log("Error: " + word.english + ", " + err.message);
    //         });
    //     }, wordIndex * 10);
    // }
};

const rerender_topic = function(errors, req, res, next) {
    get_topic_for_render(req, res, next, errors, req.body);
};

function get_topic_for_render(req, res, next, errors, formData) {
    if (!errors) errors = {};
    if (!formData) formData = {};
    models.Topic.findOne({
        where: {
            titleUrl: req.params.topic_name
        }
    }).then(topic => {
        //if there's no topic with this title
        if (topic === null) {
            next(createError(404, "Topic couldn't be found."));
        } else {
            //if the directory in the database matches the directory the user's requested
            if (topic.directory + req.params.topic_name + "/" === req.path) {
                render_topic(req, res, next, errors, formData, topic);
            } else {
                let topicDirSplit = topic.directory.substring(7).split("/");
                let topicDir = "";
                for (let topicDirPart of topicDirSplit) {
                    if (topicDirPart) {
                        topicDir += (topicDirPart.charAt(0).toUpperCase() + topicDirPart.slice(1).toLowerCase()).replace(new RegExp('-', 'g'), ' ');
                        topicDir += " > ";
                    }
                }
                topicDir += topic.title;
                res.render('redirectTopic', {
                    title: topic.title,
                    user: req.user,
                    topic: topic,
                    topicDir: topicDir
                });
            }
        }
    }).catch(err => {
        next(createError(404, "Topic couldn't be found."));
    });
}

function render_topic(req, res, next, errors, formData, topic) {
    let foundLanguage = false;
    for (let modelName in models) {
        if (getUrlForTitle(modelName) === req.params.topic_name) {
            foundLanguage = true;
            models[modelName].findAll().then(language => {
                res.render('language', {
                    title: topic.title,
                    user: req.user,
                    topic: topic,
                    topicDir: req.params.topic_name + "/",
                    words: language,
                    errors: errors,
                    formData: formData,
                    modelName: modelName,
                    pathName: req.path,
                    jsWords: JSON.stringify(language),
                    languageKeys: Object.keys(language[0].dataValues),
                    jsLanguageKeys: JSON.stringify(Object.keys(language[0].dataValues))
                });
            });
        }
    }
    if (!foundLanguage) {
        res.render('topic', {
            title: topic.title,
            user: req.user,
            topic: topic,
            topicDir: req.params.topic_name + "/"
        });
    }
}

exports.show_topics = function(req, res, next) {
    render_topics(req, res, next);
};

const rerender_topics = function(errors, req, res, next) {
    render_topics(req, res, next, errors, req.body);
};

function render_topics(req, res, next, errors, formData) {
    if (!errors) errors = {};
    if (!formData) formData = {};
    models.Topic.findAll().then(topicsDB => {
        let topics = getTopicsByParent(null, topicsDB);
        res.render('topics', {
            title: "Topics",
            topics: topics,
            user: req.user,
            errors: errors,
            formData: formData
        });
    }).catch(err => {
        res.render('topics', {
            title: "Topics",
            topics: {},
            user: req.user,
            errors: errors,
            formData: formData
        });
    });
}

function getTopicsByParent(parent, topics) {
    if (parent == undefined) parent = null;
    let foundTopics = [];
    for (let topic of topics) {
        if (topic.parentId === parent) {
            let t = newTopic(topic, topics);
            foundTopics.push(t);
        }
    }
    return foundTopics.sort(function(a, b) {
        var textA = a.title.toUpperCase();
        var textB = b.title.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
}

function newTopic(data, topics) {
    let t = {};
    t.id = data.id;
    t.title = data.title;
    t.description = data.description;
    t.dir = getUrlForTitle(t.title) + "/";
    t.parentId = data.parentId;
    t.children = getTopicsByParent(t.id, topics); //array of alphabetical pages whose parentId matches this.id
    if (t.children.length == 0) {
        t.children = undefined;
    }
    return t;
}

exports.create_new_topic = function(req, res, next) {
    let errors = {};
    return validateTopic(errors, req).then(errors => {
        if (!isEmpty(errors)) {
            rerender_topics(errors, req, res, next);
        } else {
            models.Topic.findAll().then(topicsDB => {
                let newTopic = {
                    title: req.body.title,
                    titleUrl: getUrlForTitle(req.body.title),
                    directory: "/learn/"
                };
                if (req.body.description) newTopic.description = req.body.description;
                if (req.body.content) newTopic.content = req.body.content;
                if (req.body.parentId) {
                    newTopic.parentId = req.body.parentId;
                    let id = req.body.parentId; //set starting id
                    let dir = "";
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
                    newTopic.directory = "/learn/" + dir;
                }
                models.Topic.create(newTopic).then(result => {
                    res.redirect('/topics');
                }).catch(err => {
                    if (err.message === "models is not defined") {
                        res.redirect('/topics');
                    } else {
                        errors.general = "Couldn't create the topic: " + err.message + ". Please try again.";
                        rerender_topics(errors, req, res, next);
                    }
                });
            }).catch(err => {
                errors.general = "Couldn't create the topic: " + err.message + ". Please try again.";
                rerender_topics(errors, req, res, next);
            });
        }
    });
};

exports.show_contribute = function(req, res, next) {
    res.render('contribute', {
        title: "Contribute",
        user: req.user
    });
};

exports.create_new_word = function(req, res, next) {
    let errors = {};
    return validateWord(errors, req).then(errors => {
        if (!isEmpty(errors)) {
            rerender_topic(errors, req, res, next);
        } else {
            let newWord = {};
            for (let param in req.body) {
                if (param !== "modelName" && param !== "pathName") {
                    newWord[param] = req.body[param];
                }
            }
            return models[req.body.modelName].create(newWord).then(result => {
                res.redirect(req.body.pathName || '/topics');
            }).catch(err => {
                errors.general = "Couldn't add the word: " + err.message + ". Please try again.";
                rerender_topic(errors, req, res, next);
            });
        }
    });
};

exports.show_languages = function(req, res, next) {
    render_languages(req, res, next);
};

const rerender_languages = function(errors, req, res, next) {
    render_languages(req, res, next, errors, req.body);
};

function render_languages(req, res, next, errors, formData) {
    if (!errors) errors = {};
    if (!formData) formData = {};
    models.Language.findAll().then(result => {
        models.Topic.findAll().then(topics => {
            let languages = [];
            for (let language of result) {
                let topic = getQueryRecordsByField(topics, "languageTable", language.dbName);
                if (topic !== null) {
                    if (topic.directory !== null) {
                        language.directory = topic.directory;
                    } else {
                        //work out directory
                    }
                    language.titleUrl = topic.titleUrl;
                    languages.push(language);
                }
            }
            if (languages.length === 0) languages = null;
            res.render('languages', {
                title: 'Languages',
                user: req.user,
                languages: languages,
                pathName: req.path,
                errors: errors,
                formData: formData
            });
        });
        // models.Topic.findAll().then(topics => {
        //     let found = false;
        //     for (let topicDB of topicsDB) {
        //         if (getUrlForTitle(topicDB.title) === req.params.topic_name) {
        //         }
        //     }


        //     let id = topic.id; //set starting id
        //     let dir = getUrlForTitle(topic.title);
        //     while (id) {
        //           models.Topic.findOne({
        //             where: {
        //                 id: id
        //             }
        //         }).then(result => {
        //             dir = getUrlForTitle(result.title) + "/" + dir;
        //             id = result.parentId;
        //         }).catch(err => {
        //             console.error(err.message);
        //         });
        //     }
        //     dir = "/learn/" + dir;
        // });
    }).catch(() => {
        res.render('languages', {
            title: 'Languages',
            user: req.user,
            pathName: req.path,
            errors: errors,
            formData: formData
        });
    });
}

function getQueryRecordsByField(query, field, value) {
    let result = [];
    for (let record of query) {
        if (record[field] === value) {
            result.push(record);
        }
    }
    if (result.length === 0) {
        return null;
    } else if (result.length === 1) {
        return result[0];
    } else {
        return result;
    }
}

exports.create_new_language = function(req, res, next) {
    let errors = {};
    return validateLanguage(errors, req).then(errors => {
        if (!isEmpty(errors)) {
            rerender_languages(errors, req, res, next);
        } else {
            let newLanguage = {
                dbName: req.body.dbName,
                baseColumn: req.body.baseColumn,
                primaryColumn: req.body.primaryColumn
            };
            if (req.body.secondaryColumn) newLanguage.secondaryColumn = req.body.secondaryColumn;
            if (req.body.voice) newLanguage.voice = req.body.voice;
            if (req.body.title) newLanguage.title = req.body.title;
            return models.Language.create(newLanguage).then(result => {
                res.redirect(req.body.pathName || '/topics');
            }).catch(err => {
                errors.general = "Couldn't add the language: " + err.message + ". Please try again.";
                rerender_languages(errors, req, res, next);
            });
        }
    });
};

function getUrlForTitle(title) {
    return title.replace(/\s/g, '-').toLowerCase();
}

//update all directories and titleUrls
// models.Topic.findAll().then(topicsDB => {
//     for (let topic of topicsDB) {
//         topic.titleUrl = getUrlForTitle(topic.title);
//         let id = topic.parentId; //set starting id
//         let dir = "";
//         while (id) {
//             let result;
//             for (let record of topicsDB) {
//                 if (record.id === id) {
//                     result = record;
//                     break;
//                 }
//             }
//             dir = getUrlForTitle(result.title) + "/" + dir;
//             id = result.parentId;
//         }
//         topic.directory = "/learn/" + dir;
//         topic.save();
//     }
// });

//get model directory
// let id = topic.parentId; //set starting id
// let dir = "";
// models.Topic.findAll().then(topicsDB => {
//     while (id) {
//         let result;
//         for (let record of topicsDB) {
//             if (record.id === id) {
//                 result = record;
//                 break;
//             }
//         }
//         dir = getUrlForTitle(result.title) + "/" + dir;
//         id = result.parentId;
//     }
//     dir = "/learn/" + dir + "/";
// });


// check if table exists in db
// models.sequelize.query('show tables').then(tables => {
//     let found = false;
//     for (let table of tables[0]) {
//         if (table.Tables_in_cognosco === tableSearchName) {
//             found = true;
//         }
//     }
//     // console.log(JSON.stringify(tables));
// });

let words = [{
    "english": "I, me, myself",
    "altEnglish": "",
    "pinyin": "wǒ",
    "mandarin": "我"
}, {
    "english": "you",
    "altEnglish": "",
    "pinyin": "nǐ",
    "mandarin": "你"
}, {
    "english": "good",
    "altEnglish": "",
    "pinyin": "hǎo",
    "mandarin": "好"
}, {
    "english": "hello",
    "altEnglish": "hi",
    "pinyin": "nǐ hǎo",
    "mandarin": "你好"
}, {
    "english": "again",
    "altEnglish": "",
    "pinyin": "zài",
    "mandarin": "再"
}, {
    "english": "see",
    "altEnglish": "",
    "pinyin": "jiàn",
    "mandarin": "见"
}, {
    "english": "goodbye",
    "altEnglish": "good bye, good-bye",
    "pinyin": "Zài jiàn",
    "mandarin": "再见"
}, {
    "english": "0",
    "altEnglish": "zero",
    "pinyin": "líng",
    "mandarin": "零"
}, {
    "english": "1",
    "altEnglish": "one",
    "pinyin": "yī",
    "mandarin": "一"
}, {
    "english": "2",
    "altEnglish": "two",
    "pinyin": "èr",
    "mandarin": "二"
}, {
    "english": "3",
    "altEnglish": "three",
    "pinyin": "sān",
    "mandarin": "三"
}, {
    "english": "4",
    "altEnglish": "four",
    "pinyin": "sì",
    "mandarin": "四"
}, {
    "english": "5",
    "altEnglish": "five",
    "pinyin": "wǔ",
    "mandarin": "五"
}, {
    "english": "6",
    "altEnglish": "six",
    "pinyin": "liù",
    "mandarin": "六"
}, {
    "english": "7",
    "altEnglish": "seven",
    "pinyin": "qī",
    "mandarin": "七"
}, {
    "english": "8",
    "altEnglish": "eight",
    "pinyin": "bā",
    "mandarin": "八"
}, {
    "english": "9",
    "altEnglish": "nine",
    "pinyin": "jiǔ",
    "mandarin": "九"
}, {
    "english": "10",
    "altEnglish": "ten",
    "pinyin": "shí",
    "mandarin": "十"
}, {
    "english": "hundred",
    "altEnglish": "",
    "pinyin": "bǎi",
    "mandarin": "百"
}, {
    "english": "13",
    "altEnglish": "thirteen",
    "pinyin": "shí sān",
    "mandarin": "十三"
}, {
    "english": "30",
    "altEnglish": "thirty",
    "pinyin": "sān shí",
    "mandarin": "三十"
}, {
    "english": "300",
    "altEnglish": "three hundred",
    "pinyin": "sān bǎi",
    "mandarin": "三百"
}, {
    "english": "103",
    "altEnglish": "a hundred and three, hundred and three, one hundred and three",
    "pinyin": "yī bǎi líng sān",
    "mandarin": "一百零三"
}, {
    "english": "name",
    "altEnglish": "firstname, given name",
    "pinyin": "míng",
    "mandarin": "名"
}, {
    "english": "surname",
    "altEnglish": "family name, last name",
    "pinyin": "xìng",
    "mandarin": "姓"
}, {
    "english": "(denotes question)",
    "altEnglish": "what?, what, question, (question), introduces question",
    "pinyin": "ne",
    "mandarin": "呢"
}, {
    "english": "(denotes yes/no question)",
    "altEnglish": "yes/no question, question, (question)",
    "pinyin": "ma",
    "mandarin": "吗"
}, {
    "english": "very, to be, is, are, am (for adjectives)",
    "altEnglish": "am",
    "pinyin": "hěn",
    "mandarin": "很"
}, {
    "english": "also",
    "altEnglish": "too",
    "pinyin": "yě",
    "mandarin": "也"
}, {
    "english": "happy",
    "altEnglish": "pleasure",
    "pinyin": "gāo xìng",
    "mandarin": "高兴"
}, {
    "english": "high, tall",
    "altEnglish": "tall",
    "pinyin": "gāo",
    "mandarin": "高"
}, {
    "english": "interest, prosper",
    "altEnglish": "eagerness, begin",
    "pinyin": "xìng",
    "mandarin": "兴"
}, {
    "english": "word",
    "altEnglish": "language",
    "pinyin": "zì",
    "mandarin": "字"
}, {
    "english": "meet, know",
    "altEnglish": "recognise",
    "pinyin": "rèn shí",
    "mandarin": "认识"
}, {
    "english": "not",
    "altEnglish": "",
    "pinyin": "bù",
    "mandarin": "不"
}, {
    "english": "eat",
    "altEnglish": "",
    "pinyin": "chī",
    "mandarin": "吃"
}, {
    "english": "drink",
    "altEnglish": "",
    "pinyin": "hē",
    "mandarin": "喝"
}, {
    "english": "noodles",
    "altEnglish": "",
    "pinyin": "miàn",
    "mandarin": "面"
}, {
    "english": "tea",
    "altEnglish": "",
    "pinyin": "chá",
    "mandarin": "茶"
}, {
    "english": "fish",
    "altEnglish": "",
    "pinyin": "yú",
    "mandarin": "鱼"
}, {
    "english": "food, cooked rice",
    "altEnglish": "meal, cuisine",
    "pinyin": "fàn",
    "mandarin": "饭"
}, {
    "english": "rice",
    "altEnglish": "",
    "pinyin": "mǐ",
    "mandarin": "米"
}, {
    "english": "what",
    "altEnglish": "",
    "pinyin": "shén",
    "mandarin": "什"
}, {
    "english": "is that",
    "altEnglish": "",
    "pinyin": "me",
    "mandarin": "么"
}, {
    "english": "what?, who?, something, anything",
    "altEnglish": "what, who",
    "pinyin": "shén me",
    "mandarin": "什么"
}, {
    "english": "to be, is, are, am (for nouns)",
    "altEnglish": "am",
    "pinyin": "shì",
    "mandarin": "是"
}, {
    "english": "student",
    "altEnglish": "schoolchild",
    "pinyin": "xué shēng",
    "mandarin": "学生"
}, {
    "english": "to learn, science",
    "altEnglish": "",
    "pinyin": "xué",
    "mandarin": "学"
}, {
    "english": "to be born, to grow, life",
    "altEnglish": "",
    "pinyin": "shēng",
    "mandarin": "生"
}, {
    "english": "he, him, other",
    "altEnglish": "",
    "pinyin": "tā",
    "mandarin": "他"
}, {
    "english": "she, her",
    "altEnglish": "",
    "pinyin": "tā",
    "mandarin": "她"
}, {
    "english": "(plural marker)",
    "altEnglish": "plural, plural marker",
    "pinyin": "men",
    "mandarin": "们"
}, {
    "english": "country",
    "altEnglish": "",
    "pinyin": "guó",
    "mandarin": "国"
}, {
    "english": "people",
    "altEnglish": "man, person",
    "pinyin": "rén",
    "mandarin": "人"
}, {
    "english": "USA",
    "altEnglish": "U.S, U.S., US, U.S.A, U.S.A., United States, United States of America, America",
    "pinyin": "měi guó",
    "mandarin": "美国"
}, {
    "english": "China",
    "altEnglish": "",
    "pinyin": "zhōng guó",
    "mandarin": "中国"
}, {
    "english": "Canada",
    "altEnglish": "",
    "pinyin": "jiā ná dà",
    "mandarin": "加拿大"
}, {
    "english": "Britain",
    "altEnglish": "Great Britain, GB, G.B, G.B., United Kingdom, UK, U.K, U.K., England",
    "pinyin": "yīng guó",
    "mandarin": "英国"
}, {
    "english": "old, experienced",
    "altEnglish": "",
    "pinyin": "lǎo",
    "mandarin": "老"
}, {
    "english": "teacher, master, expert",
    "altEnglish": "",
    "pinyin": "shī",
    "mandarin": "师"
}, {
    "english": "teacher",
    "altEnglish": "",
    "pinyin": "lǎo shī",
    "mandarin": "老师"
}, {
    "english": "many, much",
    "altEnglish": "",
    "pinyin": "duō",
    "mandarin": "多"
}, {
    "english": "few, less",
    "altEnglish": "",
    "pinyin": "shǎo",
    "mandarin": "少"
}, {
    "english": "how much, how many, what",
    "altEnglish": "",
    "pinyin": "duō shǎo",
    "mandarin": "多少"
}, {
    "english": "dialect, language, speech",
    "altEnglish": "",
    "pinyin": "huà",
    "mandarin": "话"
}, {
    "english": "medical, to cure, to treat",
    "altEnglish": "cure, treat",
    "pinyin": "yī",
    "mandarin": "医"
}, {
    "english": "to be born, to give birth, life",
    "altEnglish": "be born, give birth, birth",
    "pinyin": "shēng",
    "mandarin": "生"
}, {
    "english": "doctor",
    "altEnglish": "",
    "pinyin": "yī shēng",
    "mandarin": "医生"
}, {
    "english": "name",
    "altEnglish": "",
    "pinyin": "míng",
    "mandarin": "名"
}, {
    "english": "call",
    "altEnglish": "to call",
    "pinyin": "jiào",
    "mandarin": "叫"
}, {
    "english": "electric, electricity",
    "altEnglish": "electrical",
    "pinyin": "diàn",
    "mandarin": "电"
}, {
    "english": "of, possessive, e.g. (你的 -> nǐ de -> your)",
    "altEnglish": "",
    "pinyin": "de",
    "mandarin": "的"
}, {
    "english": "name",
    "altEnglish": "",
    "pinyin": "míng zì",
    "mandarin": "名字"
}, {
    "english": "with, add",
    "altEnglish": "",
    "pinyin": "jiā",
    "mandarin": "加"
}, {
    "english": "big, huge",
    "altEnglish": "large",
    "pinyin": "dà",
    "mandarin": "大"
}, {
    "english": "take, get, hold, catch",
    "altEnglish": "",
    "pinyin": "ná",
    "mandarin": "拿"
}, {
    "english": "all, both, entirely",
    "altEnglish": "",
    "pinyin": "dōu",
    "mandarin": "都"
}, {
    "english": "yes, correct",
    "altEnglish": "",
    "pinyin": "duì",
    "mandarin": "对"
}, {
    "english": "no, incorrect",
    "altEnglish": "",
    "pinyin": "bù duì",
    "mandarin": "不对"
}, {
    "english": "telephone",
    "altEnglish": "",
    "pinyin": "diàn huà",
    "mandarin": "电话"
}, {
    "english": "ordinal number, day of a month",
    "altEnglish": "number, day of month, day of the month",
    "pinyin": "hào",
    "mandarin": "号"
}, {
    "english": "numbers",
    "altEnglish": "",
    "pinyin": "hào mǎ",
    "mandarin": "号码"
}, {
    "english": "phone number",
    "altEnglish": "",
    "pinyin": "diàn huà hào mǎ",
    "mandarin": "电话号码"
}, {
    "english": "busy",
    "altEnglish": "",
    "pinyin": "máng",
    "mandarin": "忙"
}, {
    "english": "early",
    "altEnglish": "",
    "pinyin": "zǎo",
    "mandarin": "早"
}, {
    "english": "on top, upon, above, previous",
    "altEnglish": "",
    "pinyin": "shàng",
    "mandarin": "上"
}, {
    "english": "morning",
    "altEnglish": "",
    "pinyin": "zǎo shàng",
    "mandarin": "早上"
}, {
    "english": "how",
    "altEnglish": "",
    "pinyin": "zěn me",
    "mandarin": "怎么"
}, {
    "english": "manner, pattern, way",
    "altEnglish": "",
    "pinyin": "yàng",
    "mandarin": "样"
}, {
    "english": "how, how are things",
    "altEnglish": "",
    "pinyin": "zěn me yàng",
    "mandarin": "怎么样"
}, {
    "english": "how are you",
    "altEnglish": "",
    "pinyin": "nǐ zěn me yàng",
    "mandarin": "你怎么样"
}, {
    "english": "this, modern, current",
    "altEnglish": "present, now",
    "pinyin": "jīn",
    "mandarin": "今"
}, {
    "english": "sky, day",
    "altEnglish": "",
    "pinyin": "tiān",
    "mandarin": "天"
}, {
    "english": "today, now, at the present",
    "altEnglish": "in the present, the present, present",
    "pinyin": "jīn tiān",
    "mandarin": "今天"
}, {
    "english": "home, family",
    "altEnglish": "",
    "pinyin": "jiā",
    "mandarin": "家"
}, {
    "english": "is located at, at, in",
    "altEnglish": "",
    "pinyin": "zài",
    "mandarin": "在"
}, {
    "english": "north",
    "altEnglish": "",
    "pinyin": "běi",
    "mandarin": "北"
}, {
    "english": "capital city",
    "altEnglish": "capital",
    "pinyin": "jīng",
    "mandarin": "京"
}, {
    "english": "Beijing",
    "altEnglish": "",
    "pinyin": "běi jīng",
    "mandarin": "北京"
}, {
    "english": "fragrant, aromatic",
    "altEnglish": "",
    "pinyin": "xiāng",
    "mandarin": "香"
}, {
    "english": "harbour, port",
    "altEnglish": "harbor",
    "pinyin": "gǎng",
    "mandarin": "港"
}, {
    "english": "Hong Kong",
    "altEnglish": "",
    "pinyin": "xiāng gǎng",
    "mandarin": "香港"
}, {
    "english": "turn, wrench, button",
    "altEnglish": "to turn, to wrench",
    "pinyin": "niǔ",
    "mandarin": "纽"
}, {
    "english": "make an appointment, invite",
    "altEnglish": "to make an appointment, to invite",
    "pinyin": "yuē",
    "mandarin": "约"
}, {
    "english": "New York",
    "altEnglish": "",
    "pinyin": "niǔ yuē",
    "mandarin": "纽约"
}, {
    "english": "how, which, where, every",
    "altEnglish": "",
    "pinyin": "nǎ",
    "mandarin": "哪"
}, {
    "english": "where, wherever",
    "altEnglish": "where?",
    "pinyin": "nǎ r",
    "mandarin": "哪儿"
}, {
    "english": "human relationship, order",
    "altEnglish": "relationship",
    "pinyin": "lún",
    "mandarin": "伦"
}, {
    "english": "kindhearted",
    "altEnglish": "",
    "pinyin": "dūn",
    "mandarin": "敦"
}, {
    "english": "London",
    "altEnglish": "",
    "pinyin": "lún dūn",
    "mandarin": "伦敦"
}, {
    "english": "table, desk, stage",
    "altEnglish": "counter, platform",
    "pinyin": "tái",
    "mandarin": "台"
}, {
    "english": "bay, gulf, to moor",
    "altEnglish": "moor",
    "pinyin": "wān",
    "mandarin": "湾"
}, {
    "english": "Taiwan",
    "altEnglish": "",
    "pinyin": "tái wān",
    "mandarin": "台湾"
}, {
    "english": "live, stay",
    "altEnglish": "to live, to stay",
    "pinyin": "zhù",
    "mandarin": "住"
}, {
    "english": "rise, raise, get up, start",
    "altEnglish": "to rise, to raise, to get up, to start",
    "pinyin": "qǐ",
    "mandarin": "起"
}, {
    "english": "sorry, unworthy, let down",
    "altEnglish": "to be unworthy, to let down, I'm sorry",
    "pinyin": "duì bù qǐ",
    "mandarin": "对不起"
}];