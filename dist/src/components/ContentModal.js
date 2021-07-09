class ContentModal {
  $contentModal = null;
  data = null;

  constructor({ $target, data }) {
    const $contentModal = document.createElement('div');
    $contentModal.className = 'ContentModal';
    this.$contentModal = $contentModal;
    $target.appendChild(this.$contentModal);
    this.data = data;
    this.render();
  }

  setState(nextData) {
    this.data = nextData;
    this.render();
  }

  onKeyClose(event) {
    this.data = null;
    if (event.keyCode === 27) {
      this.$contentModal.style.display = 'none';
      this.$contentModal.innerHTML = '';
    }
  }

  onClose() {
    this.data = null;
    this.$contentModal.style.display = 'none';
    this.$contentModal.innerHTML = '';
  }

  render() {
    if (this.data.visible) {
      const { name, url, temperament, origin } = this.data.data;

      const overlay = document.createElement('div');
      overlay.className = 'overlay';

      const contentWrapper = document.createElement('section');
      contentWrapper.className = 'content-wrapper';

      const contentHeader = document.createElement('header');
      contentHeader.className = 'content-header';

      const contentTitle = document.createElement('h2');
      contentTitle.className = 'content-title';
      contentTitle.textContent = name;

      const closeBtn = document.createElement('span');
      closeBtn.className = 'close-btn';
      closeBtn.textContent = 'X';

      const contentImage = document.createElement('img');
      contentImage.className = 'content-image';
      contentImage.src = url;
      contentImage.alt = name;

      const contentInfo = document.createElement('article');
      contentInfo.className = 'content-info';

      const catTemperament = document.createElement('p');
      catTemperament.className = 'cat-temperament';
      catTemperament.textContent = `성격: ${temperament}`;

      const catOrigin = document.createElement('p');
      catOrigin.className = 'cat-origin';
      catOrigin.textContent = `태생: ${origin}`;

      contentHeader.appendChild(contentTitle);
      contentHeader.appendChild(closeBtn);

      contentInfo.appendChild(catTemperament);
      contentInfo.appendChild(catOrigin);

      contentWrapper.appendChild(contentHeader);
      contentWrapper.appendChild(contentImage);
      contentWrapper.appendChild(contentInfo);

      this.$contentModal.appendChild(overlay);
      this.$contentModal.appendChild(contentWrapper);
      this.$contentModal.style.display = 'block';

      // 이벤트
      document.body.addEventListener('keydown', (event) => {
        this.onKeyClose(event);
      });

      closeBtn.addEventListener('click', () => {
        this.onClose();
      });

      overlay.addEventListener('click', () => {
        this.onClose();
      });

      // modal big size - modification
      /* 
      scrollHeight : 스크롤바 높이를 뺀 내용 전체의 높이
      clientHeight: 스크롤바 높이를 뺀 가시적인 높이
      offsetHeight: 스크롤바 높이를 포함한 가시적인 높이
      */

      const modalElement = document.querySelector('.content-wrapper');
      let modalGet = modalElement.getBoundingClientRect();
      if (this.$contentModal.offsetHeight <= modalGet.height) {
        // console.log('실행', window.innerWidth);
        modalElement.style.width = `${modalGet.width * 0.9}px`;
      }
    }
  }
}
