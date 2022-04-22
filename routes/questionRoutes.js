var express = require('express');
var router = express.Router();
var questionController = require('../controllers/questionController.js');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/profile', requiresLogin, questionController.userQuestions);

router.get('/create', questionController.qCreate);

router.get('/', questionController.list);

router.get('/:id', questionController.show);

router.post('/', requiresLogin, questionController.create);

router.put('/:id', questionController.update);

router.delete('/:id', questionController.remove);

module.exports = router;
