const router = require('express').Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getBooks);
router.post('/borrow', bookController.borrowBook);
router.post('/return', bookController.returnBook);

module.exports = router;