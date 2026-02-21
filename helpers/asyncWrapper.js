function asyncWrapper(promise) {
  return promise.then((data) => [undefined, data]).catch((error) => [error]);
}

module.exports = asyncWrapper;
