class SearchResult {
  $searchResult = null;
  data = null;
  onClick = null;

  constructor({ $target, initialData, onClick, onScroll }) {
    this.$searchResult = document.createElement('main');
    this.$searchResult.className = 'SearchResult';

    this.data = initialData;
    this.onClick = onClick;

    this.onScroll = onScroll;

    $target.appendChild(this.$searchResult);
    this.render();

    // refresh한 뒤에 유지를 위해
    window.lazyload.createLazyLoad();
  }

  setState(nextData) {
    this.data = nextData;
    this.render();
    // random이나 검색값에 따른 데이터가 바뀔때 다시실행
    window.lazyload.createLazyLoad();

    window.scrollPaging(this.onScroll);
  }

  render() {
    // 초기에 sessionStorage에 data가 없는 경우
    if (this.data === null) {
      return;
    }

    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    // ! searchResult reset
    this.$searchResult.textContent = '';

    if (this.data.length > 0) {
      // searchResult에 appendChild로 넣기위해 container생성
      const container = document.createElement('div');
      container.className = 'container';
      this.data.map((cat) => {
        new Card({
          $target: container,
          data: cat,
        });
      });
      this.$searchResult.appendChild(container);

      container.addEventListener('click', (event) => {
        let element = event.target;

        while (!element.classList.contains('card')) {
          element = element.parentElement;
          if (element.nodeName === 'BODY') {
            element = null;
            return;
          }
          // IE는 아직 지원안함
          // element = element.closest('.card');
          // if (element == null) {
          //   return;
          // }
        }
        // path, IE 지원안함 while대신사용
        // const path = event.path;
        // console.log('path', path);
        // const card = path.find((composedElement) =>
        //   console.log(composedElement.className === 'card')
        // );

        if (element.className === 'card') {
          const cardId = element.dataset.id;
          this.onClick(cardId);
        }
      });

      container.classList.add('show');
    } else {
      const recentKeyword = window.sessionStore.getItem('recentKeyword');
      const noSearchResult = document.createElement('p');
      noSearchResult.className = 'no-searchResult';
      noSearchResult.textContent = `죄송합니다, "${recentKeyword}"에 대한 결과를 찾을 수 없습니다.`;
      const noSearchImage = document.createElement('span');
      noSearchImage.className = 'no-searchImage';
      noSearchImage.textContent = '😿';

      this.$searchResult.appendChild(noSearchResult);
      this.$searchResult.appendChild(noSearchImage);
    }
  }
}
