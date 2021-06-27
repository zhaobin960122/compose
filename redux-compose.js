function compose(middleware) {
  if (middleware.length === 0) {
    return (arg) => arg;
  }
  if (middleware.length === 1) {
    return middleware[0];
  }
  return middleware.reduce((a, b) => {
    return (...args) => a(b(...args));
  });
}
