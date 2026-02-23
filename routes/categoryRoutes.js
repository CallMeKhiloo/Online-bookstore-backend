const express = require('express');
const {categoryController} = require('../controllers');
const asyncWrapper = require('../helpers/asyncWrapper');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(categoryController.getAllCategories(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len : data.length,
    data
  });
});

// admin-restricted
router.post('/', async (req, res, next) => {
  const [error, data] = await asyncWrapper(categoryController.createCategory(req));
  if (error) return next(error);
  res.status(201).json({
    status: 'successful',
    len : 1,
    data
  });
});

router.get('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(categoryController.getCategory(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len : 1,
    data
  });
});

router.get('/:id/books', async (req, res, next) => {
  const [error, data] = await asyncWrapper(categoryController.getBooksByCategory(req));
  if (error) return next(error);
  res.status(200).json({
    status: 'successful',
    len : data.length,
    data
  });
});

// admin-restricted
router.patch('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(categoryController.updateCategory(req));
  if (error) return next(error);
  res.status(204).send();
});

// admin-restricted
router.delete('/:id', async (req, res, next) => {
  const [error, data] = await asyncWrapper(categoryController.deleteCategory(req));
  if (error) return next(error);
  res.status(204).send();
});

module.exports = router;