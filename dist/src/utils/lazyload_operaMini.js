// Opera Mini Extreme Mode script
(function () {
  'use strict';

  if ('IntersectionObserver' in window) {
  } else {
    var lazyImages = document.getElementsByClassName('lazy');
    [].forEach.call(lazyImages, function (lazyImage) {
      lazyImage.src = lazyImage.dataset.src;
      lazyImage.classList.remove('lazy');
      lazyImage.height = 'auto';
    });
  }
})();
