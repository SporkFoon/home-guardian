const express = require('express');
const router = express.Router();
const readingsRoutes = require('./readings');
const safetyRoutes = require('./safety');

router.use('/readings', readingsRoutes);
router.use('/status', safetyRoutes);

module.exports = router;