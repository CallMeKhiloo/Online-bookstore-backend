const express = require('express');
const {bookController} = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.getAllBooks(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data
  });
});

// admin-restricted
router.post('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.createBook(req));
  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    len: 1,
    data
  });
});

router.get('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.getBook(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: 1,
    data
  });
});

// admin-restricted
router.patch('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.updateBook(req));
  if (error) return next(error);
  res.status(204).send();
});


// admin-restricted
router.delete('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(bookController.deleteBook(req));
  if (error) return next(error);
  res.status(204).send()
});

module.exports = router;