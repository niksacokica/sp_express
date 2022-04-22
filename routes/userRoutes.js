var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

router.get('/register', userController.showRegister);
router.get('/login', userController.showLogin);
router.post('/login', userController.login);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);

/*
 * GET
 */
router.get('/', userController.list);

/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', userController.create);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
