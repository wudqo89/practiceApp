// For load validator and require in test file.
// NOTE: Comment below lines, if you using es6 module.
(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.sessionStore = factory();
  }
})(this, function () {
  // implement code here
  // ! sessionStorage로 변수명을 정하면 안된다
  const sessionStore = {
    getItem(key) {
      const value = sessionStorage.getItem(key);
      if (key === 'data') {
        return value === null ? null : JSON.parse(value);
      } else {
        return value === null ? [] : JSON.parse(value);
      }
    },

    setItem(key, value) {
      if (value === null || value === undefined) {
        return;
      }
      const toJson = JSON.stringify(value);
      sessionStorage.setItem(key, toJson);
    },
  };

  return sessionStore;
});
