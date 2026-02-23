const express = require('express');
const {authorController} = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.getAllAuthors(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data
  });
});

// admin-restricted
router.post('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.createAuthor(req));
  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    len: 1,
    data
  });
});

router.get('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.getAuthor(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: 1,
    data
  });
});

router.get('/:id/books', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.getBooksByAuthor(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len: data.length,
    data
  });
});

// admin-restricted
router.patch('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.updateAuthor(req));
  if (error) return next(error);
  res.status(204).send();
});


// admin-restricted
router.delete('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(authorController.deleteAuthor(req));
  if (error) return next(error);
  res.status(204).send();
});


module.exports = router;