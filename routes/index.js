const express = require('express');
const userRouter = require('./userRoutes');
const uploadRouter = require('./uploadRoutes');
const categoryRouter = require('./categoryRoutes');
const authorRouter = require('./authorRoutes');
const bookRouter = require('./bookRoutes');
const cartRouter = require('./cartRoutes');

const router = express.Router();

router.use('/users', userRouter);
router.use('/upload', uploadRouter);
router.use('/category', categoryRouter);
router.use('/author', authorRouter);
router.use('/book', bookRouter);
router.use('/cart', cartRouter);


module.exports = router;
