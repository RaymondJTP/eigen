const router = require('express').Router();
const memberRoutes = require('./memberRoutes');
const errorHandler = require('../middlewares/errorHandler');

router.use('/member', memberRoutes);

router.use(errorHandler);
module.exports = router;