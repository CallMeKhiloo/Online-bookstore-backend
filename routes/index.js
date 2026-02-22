const express = require('express');
const userRouter = require('./userRoutes');
const uploadRouter = require('./uploadRoutes');

const router = express.Router();

router.use('/users', userRouter);
router.use('/upload', uploadRouter);

module.exports = router;
