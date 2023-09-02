const router = require('express').Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getBooks);

module.exports = router;