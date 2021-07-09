(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.scrollPaging = factory();
  }
})(this, function () {
  const scrollPaging = function (fetchData) {
    window.addEventListener('scroll', () => {
      window.throttling(() => {
        console.log('Activate Scroll Event');
        if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
        fetchData();
        // console.log(arguments);
        // console.log(...arguments);
      }, 700);
    });
  };

  function getScrollTop() {
    return window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
  }

  function getDocumentHeight() {
    const body = document.body;
    const html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }

  return scrollPaging;
});
