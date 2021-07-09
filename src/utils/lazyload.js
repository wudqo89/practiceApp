// ==================
// Lazy load images with IntersectionObserver
// https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
// ==================

(function (root, factory) {
  'use strict';
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.lazyload = factory();
  }
})(this, function () {
  const lazyload = {
    createLazyLoad() {
      // Get our lazy-loaded images
      let lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

      // Do this only if IntersectionObserver is supported
      if ('IntersectionObserver' in window) {
        // Create new observer object
        let lazyImageObserver = new IntersectionObserver(function (
          entries,
          observer
        ) {
          // Loop through IntersectionObserverEntry objects
          entries.forEach(function (entry) {
            // Do these if the target intersects with the root
            if (entry.isIntersecting) {
              // console.log(entry); // enable this to see what an entry object is like
              let lazyImage = entry.target;
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.add('fadeIn');
              lazyImage.classList.remove('lazy');
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });
        // Loop through and observe each image
        lazyImages.forEach(function (lazyImage) {
          lazyImageObserver.observe(lazyImage);
        });
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(function (lazyImage, index) {
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.add('fadeIn');
          lazyImage.classList.remove('lazy');
        });
      }
    },
  };

  return lazyload;
});
