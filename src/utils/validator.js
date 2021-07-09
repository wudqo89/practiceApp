// For load validator and require in test file.
// NOTE: Comment below lines, if you using es6 module.
(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.validator = factory();
  }
})(this, function () {
  // implement code here
  const validator = {
    isNumber(a) {
      return typeof a === 'number';
    },
    // 넘어온 값이 빈값인지 체크합니다.
    // !value 하면 생기는 논리적 오류를 제거하기 위해
    // 명시적으로 value == 사용
    // [], {} 도 빈값으로 처리
    isEmptyInput(value) {
      if (
        value == '' ||
        value == null ||
        value == undefined ||
        (value != null &&
          typeof value == 'object' &&
          !Object.keys(value).length)
      ) {
        return true;
      } else {
        return false;
      }
    },
    isEmptyObject(param) {
      return Object.keys(param).length === 0 && param.constructor === Object;
    },
    isEmptyArray(param) {
      return Object.keys(param).length === 0;
    },
  };

  return validator;
});

// https://swtpumpkin.github.io/javascript/checkEmptyObject/

// NOTE: Uncomment below lines, if you using es6 module.
// export default {
//   isNumber(a) {
//     return typeof a === 'number'
//   }
// }
