const router = require('express').Router();
const memberController = require('../controllers/memberController');

router.get('/list', memberController.getListMember);
router.post('/register', memberController.registerMember);
router.post('/login', memberController.loginMember);

module.exports = router;

