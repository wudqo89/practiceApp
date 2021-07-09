(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.preventKeycode = factory();
  }
})(this, function () {
  // https://caileb.tistory.com/158
  // implement code here
  const preventKeycode = function (event) {
    if (event.defaultPrevented) {
      return;
    }
    let handled = false;
    let kCode = event.keyCode;

    if (kCode >= 48 && kCode <= 57) {
      // 숫자 0~9 제한
      handled = true;
    } else if (kCode === 8) {
      // 백스페이스
      handled = true;
    } else if (kCode === 16) {
      // shift
      handled = true;
    } else if (event.altKey) {
      // alt
      handled = true;
    } else if (event.ctrlKey) {
      // ctrl
      handled = true;
    }

    if (handled) {
      event.preventDefault();
    }
  };

  return preventKeycode;
});
