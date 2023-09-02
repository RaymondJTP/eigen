const router = require('express').Router();
const memberRoutes = require('./memberRoutes');
const bookRoutes = require('./bookRoutes');
const authentication = require('../middlewares/authentication');
const errorHandler = require('../middlewares/errorHandler');

router.use('/member', memberRoutes);
router.use(authentication);
router.use('/books', bookRoutes);
router.use(errorHandler);

module.exports = router;