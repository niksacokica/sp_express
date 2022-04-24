const QuestionModel = require('../models/questionModel.js');
const CommentModel = require('../models/commentModel.js');

module.exports = {
    /**
     * questionController.list()
     */
    list: function (req, res) {
        QuestionModel.find()
            .populate({
                path: "postedBy",
                path: "comments",
                populate: {
                    path: "postedBy",
                }
            })
            .exec(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting question.',
                        error: err
                    });
                }
                var data = [];
                data.question = questions;
                data.question.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0 });
                console.log(data);
                data.session = req.session;
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
            hasAnswer: false,
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

            return res.redirect('back');
        });
    },

    /**
     * questionController.update()
     */
    update: function (req, res) {
        var id = req.body.id;

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
            .populate({
                path: "postedBy",
                path: "comments",
                populate: {
                    path: "postedBy",
                }
                })
            .exec(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting question.',
                        error: err
                    });
                }
                var data = [];
                data.question = questions;
                data.question.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0 });
                return res.render('question/profile', data);
            });
    },

    accept: function (req, res) {
        var comment_id = req.body.comment_id;
        var question_id = req.body.question_id;

        QuestionModel.findOne({ _id: question_id }, function (err, question) {
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

            question.hasAnswer = true;

            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }
            });
        });

        CommentModel.findOne({ _id: comment_id }, function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting comment',
                    error: err
                });
            }

            if (!comment) {
                return res.status(404).json({
                    message: 'No such comment'
                });
            }

            comment.answer = true;

            comment.save(function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating comment.',
                        error: err
                    });
                }
            });
        });

        return res.redirect('back');
    },

    commentAdd: function (req, res) {
        var comment = new CommentModel({
            content: req.body.comment,
            postedBy: req.session.userId,
            answer: false
        });

        comment.save(function (err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating comment',
                    error: err
                });
            }
        });

        QuestionModel.findOne({ _id: req.body.id }, function (err, question) {
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
            
            question.comments.push(comment._id);

            question.save(function (err, question) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating question.',
                        error: err
                    });
                }
            });
        });

        return res.redirect('back');
    }
};
