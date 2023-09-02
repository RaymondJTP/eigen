const router = require('express').Router();
const memberRoutes = require('./memberRoutes');

router.use('/member', memberRoutes);

module.exports = router;