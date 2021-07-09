// https://www.zerocho.com/category/JavaScript/post/59a8e9cb15ac0000182794fa

(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.throttling = factory();
  }
})(this, function () {
  // implement code here
  let throttleCheck;

  const throttling = function (callback, milliseconds) {
    if (!throttleCheck) {
      // setTimeout은 timer id를 반환한다.
      throttleCheck = setTimeout(() => {
        // 여기서의 arguments는 scrollPaging.js에 fetchData이며 App.js까지 거슬러올라가면 async로 연결된 함수를 뜻한다. '...'(spread operator)로 인해서 그 안에 parameter값을 지정한다.
        callback(...arguments);
        // 초기에 undefined로 인해 false가 성립 이후에 setTimeout으로 인해 다시 false를 재할당 후 infinite 실행
        throttleCheck = false;
      }, milliseconds);
    }
  };

  return throttling;
});
