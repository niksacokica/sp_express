const QuestionModel = require('../models/questionModel.js');

module.exports = {
    /**
     * questionController.list()
     */
    list: function (req, res) {
        QuestionModel.find()
            .populate('postedBy')
            .exec(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting question.',
                        error: err
                    });
                }
                var data = [];
                data.question = questions;
                return res.render('question/all', data);
            });
    },

    /**
     * questionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({ _id: id }, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }

            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            return res.json(question);
        });
    },

    /**
     * questionController.create()
     */
    create: function (req, res) {
        var question = new QuestionModel({
            name: req.body.name,
            description: req.body.description,
            postedBy: req.session.userId,
            date: Date.now(),
            tags: req.body.tags
        });

        question.save(function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating question',
                    error: err
                });
            }

            return res.status(201).json(question);
        });
    },

    /**
     * questionController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionModel.findOne({ _id: id }, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question',
                    error: err
                });
            }
            
            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }

            question.name = req.body.name ? req.body.name : question.name;
            question.description = req.body.description ? req.body.description : question.description;
            question.postedBy = req.body.postedBy ? req.body.postedBy : question.postedBy;
            question.tags = req.body.tags ? req.body.tags : question.tags;

            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }

                return res.json(question);
            });
        });
    },

    /**
     * questionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        QuestionModel.findByIdAndRemove(id, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    qCreate: function (req, res) {
        res.render('question/create');
    },

    userQuestions: function(req, res) {
        QuestionModel.find({ postedBy: req.session.userId })
            .populate('postedBy')
            .exec(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting question.',
                        error: err
                    });
                }
                var data = [];
                data.question = questions;
                return res.render('question/all', data);
            });
    },
};