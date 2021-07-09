class PreLoader {
  constructor({ $target }) {
    this.loaderWrap = document.createElement('div');
    this.loaderWrap.className = 'preloader';

    $target.appendChild(this.loaderWrap);
    this.render();
  }

  show() {
    this.loaderWrap.classList.add('show');
  }
  hidden() {
    this.loaderWrap.classList.add('hidden');
    // clearTimeout 꼭 필요치 않음.
    this.timeoutID = setTimeout(() => {
      this.loaderWrap.classList.remove('show', 'hidden');
    }, 1000);
  }

  render() {
    const loaderImg = document.createElement('span');
    loaderImg.className = 'preloader-img';
    const loaderText = document.createElement('span');
    loaderText.className = 'preloader-text';
    loaderText.textContent = 'Loading';

    this.loaderWrap.appendChild(loaderImg);
    this.loaderWrap.appendChild(loaderText);
  }
}
