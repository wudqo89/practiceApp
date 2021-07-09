class SearchInput {
  constructor({ $target, keywords, onSearch, onSearchRandom }) {
    this.searchWrap = document.createElement('section');
    this.searchWrap.className = 'SearchInputWrap';
    this.onSearch = onSearch;
    this.onSearchRandom = onSearchRandom;
    // App.js에서 처음 선언을 통해서 []을 생성(sessionStorage.js참고)
    this.keywords = keywords;

    $target.appendChild(this.searchWrap);

    // ! Cookie global 변수
    const cookieIndex = 0;
    this.cookieIndex = cookieIndex;
    let cookieList = {};
    this.cookieList = cookieList;

    this.render();

    this.focusOnSearchInput();

    console.log('SearchInput created.', this);
  }
  // end: constructor
  focusOnSearchInput() {
    const searchInput = document.querySelector('.searchInput');
    searchInput.focus();
  }

  addRecentKeyword(keyword) {
    if (this.keywords.includes(keyword)) return;
    if (this.keywords.length == 5) this.keywords.shift();

    this.keywords.push(keyword);
    window.sessionStore.setItem('keywords', this.keywords);

    // 여기서 render하면 searchResult에서 검색value 못받는다
    // 그러나 recent 키워드를 통해서 해결해야된다.
    this.render();
  }

  selectRecentKeyword(keyword) {
    window.sessionStore.setItem('recentKeyword', keyword);
  }

  searchByKeyword(keyword, event) {
    if (keyword.length == 0) return;
    this.addRecentKeyword(keyword);
    this.selectRecentKeyword(keyword);
    this.onSearch(keyword);
  }

  resetInput() {
    const searchInput = document.querySelector('.searchInput');
    searchInput.value = '';
  }

  createPopupItem(inputValue, itemIndex) {
    const searchContentsList = document.querySelector('.searchContentsList');
    const li = document.createElement('li');
    const a = document.createElement('a');
    const span = document.createElement('span');
    a.setAttribute('href', 'javascript:;');
    a.setAttribute('class', 'keyword');
    a.setAttribute('data-searchkeyword', inputValue);
    a.textContent = inputValue;
    span.setAttribute('data-searchkeyword', inputValue);
    span.setAttribute('data-index', itemIndex);
    span.setAttribute('class', 'del-button');
    span.textContent = '삭제';

    li.appendChild(a);
    li.appendChild(span);

    searchContentsList.appendChild(li);
  }
  // https://www.coupang.com/np/search?q=로션channel=recent
  // openPopup(event, searchList) {
  openPopup(searchList) {
    const searchPopup = document.querySelector('.searchPopup');

    if (searchList.childElementCount >= 1) {
      searchPopup.style.display = 'block';
    } else {
      return false;
    }
  }

  // ! ImageInfo와 중복되는 helper함수 정리하자
  // helper function
  getParents(targetElement) {
    const result = [];
    for (
      let parentEl = targetElement && targetElement.parentElement;
      parentEl;
      parentEl = parentEl.parentElement
    ) {
      result.push(parentEl);
    }
    return result;
  }

  closePopup(event, parentClassName, targetElement) {
    const searchContentsList = document.querySelector('.searchContentsList');
    let checkParent = [];

    if (event.target.className === 'overlay') {
      return;
    }

    this.getParents(event.target).forEach((element) => {
      const getTargetParent = element.classList.contains(parentClassName);
      checkParent.push(getTargetParent);
    });

    if (checkParent.includes(true)) {
      // 검색팝업내에서 팝업유지.
      return;
    } else if (
      searchContentsList.childElementCount >= 1 &&
      this.getParents(event.target)[0].tagName === 'LI'
    ) {
      // 키워드 삭제 버튼을 누를 시 팝업유지
      return;
    } else {
      targetElement.style.display = 'none';
    }
  }

  deleteKeyword(targetButton) {
    const checkDelButton = targetButton.classList.contains('del-button');
    const searchListItem = targetButton.parentElement;
    const searchContentsList = targetButton.parentElement.parentElement;

    // 화면에서 삭제
    if (checkDelButton) {
      searchContentsList.removeChild(searchListItem);
    }

    // sessionStorage 삭제
    this.keywords.splice(targetButton.dataset.index, 1);
    window.sessionStore.setItem('keywords', this.keywords);

    // 쿠키값 삭제
    let saved = Cookies.getJSON('searchKeyword');
    let savedCount = Cookies.getJSON('savedKeywordCount');
    let delSavedKeyword;
    let delSavedCount;

    if (saved && checkDelButton) {
      const targetIndex = targetButton.dataset.index;
      delete saved[targetIndex];
      delSavedKeyword = saved;
      savedCount--;
      delSavedCount = savedCount;

      Cookies.set('searchKeyword', delSavedKeyword);
      Cookies.set('savedKeywordCount', delSavedCount);
    }
  }

  keywordReSearchDelete(event) {
    const targetButton = event.target;
    let searchKeyword = targetButton.dataset.searchkeyword;
    if (searchKeyword !== undefined && targetButton.className === 'keyword') {
      this.searchByKeyword(searchKeyword, event);
    } else if (
      searchKeyword !== undefined &&
      targetButton.className === 'del-button'
    ) {
      this.deleteKeyword(targetButton);
    }
  }

  // http://ebay.auction.co.kr/#
  // source tap > jscookies.js > global > schKwdRecent
  // https://www.convertstring.com/ko/EncodeDecode/UrlDecode

  setCookie(value) {
    // set cookie
    // !왜 이게 안먹히지?
    // let { cookieIndex, cookieList } = this;
    const date_now = new Date().toISOString().slice(0, 10);
    let saved = Cookies.getJSON('searchKeyword');
    let savedCount = Cookies.getJSON('savedKeywordCount');

    if (saved) {
      this.cookieIndex = savedCount;
      this.cookieIndex++;
      this.cookieList = saved;
      this.cookieList[this.cookieIndex] = { v: value, d: date_now };
      Cookies.set('searchKeyword', this.cookieList, { expires: 30 });
      Cookies.set('savedKeywordCount', this.cookieIndex, { expires: 30 });
    } else {
      this.cookieList[this.cookieIndex] = { v: value, d: date_now };
      Cookies.set('searchKeyword', this.cookieList, { expires: 30 });
      Cookies.set('savedKeywordCount', this.cookieIndex, { expires: 30 });
    }
  }

  render() {
    // addRecentKeyword에서 this.render를 한번 더하기 때문에
    this.searchWrap.textContent = '';

    const searchInput = document.createElement('input');
    searchInput.className = 'searchInput';
    searchInput.placeholder =
      '고양이를 검색해보세요. (테스트: 다른 키워드 입력)';

    const searchPopup = document.createElement('div');
    searchPopup.className = 'searchPopup';

    const searchContents = document.createElement('div');
    searchContents.className = 'searchContents';

    const searchContentsTitle = document.createElement('h3');
    searchContentsTitle.textContent = '최근 검색어';

    const searchContentsList = document.createElement('ol');
    searchContentsList.className = 'searchContentsList';

    const randomButton = document.createElement('button');
    randomButton.className = 'random-btn';
    randomButton.setAttribute('type', 'button');
    randomButton.textContent = 'random';

    searchContents.appendChild(searchContentsTitle);
    searchContents.appendChild(searchContentsList);
    searchPopup.appendChild(searchContents);
    this.searchWrap.appendChild(searchInput);
    this.searchWrap.appendChild(searchPopup);
    this.searchWrap.appendChild(randomButton);

    // keywords를 가지고 createPopupItems
    this.keywords.map((keyword, index) => {
      this.createPopupItem(keyword, index);
    });

    window.addEventListener('DOMContentLoaded', () => {
      if (Cookies.get('searchKeyword')) {
        let getCookies = Cookies.get('searchKeyword');
        let cookiesToJson = JSON.parse(getCookies);
        let cookiesLength = Object.keys(cookiesToJson).length;
        let cookieItem;

        for (let i = 0; i < cookiesLength; i++) {
          cookieItem = cookiesToJson[i];

          // https://foreachdreamcometrue.tistory.com/3
          if (cookieItem === undefined) {
            Object.keys(cookiesToJson).forEach((key, newKey) => {
              Object.defineProperty(
                cookiesToJson,
                newKey,
                Object.getOwnPropertyDescriptor(cookiesToJson, key)
              );
            });
            // 키워드를 삭제 후 위에 코드로 인해 key값을 앞으로 땡겨서 정렬 시키고 나면 가장 마지막 prop만 중복값이다. 그래서 마지막을 삭제한다
            delete cookiesToJson[cookiesLength];
            Cookies.set('searchKeyword', cookiesToJson, { expires: 30 });
            // ! 이렇게 강제 reload말고 방법이 없을까?
            // true: 서버에서 현재페이지 reload
            // false(default): 캐시에서 현재페이지 reload
            location.reload();
          }
          this.addRecentKeyword(cookieItem.v);
        }
      }
    });

    // 검색어 enter
    searchInput.addEventListener('keyup', (event) => {
      const targetValue = event.target.value;
      const checkInput = window.validator.isEmptyInput(targetValue);
      const itemIndex = searchContentsList.childElementCount;

      if (event.keyCode === 13) {
        if (checkInput) {
          alert('검색어를 입력해주세요!');
        } else {
          if (this.keywords.includes(targetValue)) {
            this.searchByKeyword(targetValue, event);
            return;
          }
          this.searchByKeyword(targetValue, event);
          this.setCookie(targetValue);
        }

        // 검색키워드 6개가 되면 삭제 후 5개만 노출
        let getCookies = Cookies.getJSON('searchKeyword');
        let cookiesLength = Object.keys(getCookies).length;
        let savedCount = Cookies.getJSON('savedKeywordCount');
        let delSavedCount;
        if (cookiesLength >= 6) {
          delete getCookies['0'];

          Object.keys(getCookies).forEach((key, newKey) => {
            Object.defineProperty(
              getCookies,
              newKey,
              Object.getOwnPropertyDescriptor(getCookies, key)
            );
          });
          delete getCookies[cookiesLength - 1];
          savedCount--;
          delSavedCount = savedCount;
          Cookies.set('savedKeywordCount', delSavedCount);
        }
        Cookies.set('searchKeyword', getCookies, { expires: 30 });
      }
    });

    // 검색 커서 mousedown시에 검색팝업 오픈
    searchInput.addEventListener('mousedown', (event) => {
      this.openPopup(searchContentsList);
    });

    // 검색 팝업 닫기 - body
    // ! seachResult가 나오기 전까지 body영역이 input에만 잡혀서 문제가 되지만
    document.body.addEventListener('click', (event) => {
      this.closePopup(event, 'SearchInputWrap', searchPopup);
    });

    searchInput.addEventListener('focus', this.resetInput);

    // 저장된 키워드 클릭후 재검색 or 삭제
    searchContentsList.addEventListener('click', (event) => {
      this.keywordReSearchDelete(event);
    });

    randomButton.addEventListener('click', this.onSearchRandom);
  }
}
