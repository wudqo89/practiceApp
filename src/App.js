class App {
  $target = null;
  data = window.sessionStore.getItem('data');
  keywords = window.sessionStore.getItem('keywords');

  constructor($target) {
    this.$target = $target;

    this.searchInput = new SearchInput({
      $target,
      keywords: this.keywords,
      onSearch: async (keyword) => {
        // !PreLoader.js에서 toggle()을 사용하기 때문에 여기서는 true, 아래 response.isError이후에는 false처리
        this.preloader.show();
        const response = await api.fetchCats(keyword);

        if (!response.isError && response.data.length === 0) {
          this.preloader.hidden();
        }
        if (!response.isError) {
          window.sessionStore.setItem('data', response.data);
          this.setState(response.data);
          this.preloader.hidden();
        } else {
          this.error.setState(response.data);
        }
      },
      onSearchRandom: async () => {
        this.preloader.show();
        const response = await api.fetchCatsRandom();

        if (!response.isError) {
          window.sessionStore.setItem('data', response.data);
          this.setState(response.data);
          this.preloader.hidden();
        } else {
          this.error.setState(response.data);
        }
      },
    });

    this.searchResult = new SearchResult({
      $target,
      initialData: this.data,
      onClick: async (imageId) => {
        this.preloader.show();
        // const response = await api.fetchCatInfo(image.id);
        const response = await api.fetchCatInfo(imageId);

        if (!response.isError) {
          let data = response.data;
          this.contentModal.setState({
            visible: true,
            // image,
            data,
          });
          this.preloader.hidden();
        } else {
          this.error.setState(response.data);
        }
      },
      onScroll: async () => {
        this.preloader.show();

        const response = await api.fetchCatsRandom();

        if (!response.isError) {
          const beforeData = window.sessionStore.getItem('data');
          const nextData = beforeData.concat(response.data);

          window.sessionStore.setItem('data', nextData);
          this.setState(nextData);

          this.preloader.hidden();
        } else {
          this.error.setState(response.data);
        }
      },
    });

    this.contentModal = new ContentModal({
      $target,
      data: {
        visible: false,
        // image: null,
      },
    });

    this.preloader = new PreLoader({
      $target,
    });

    this.toggleDarkmode = new ToggleDarkmode({
      $target,
    });

    this.error = new ErrorPage({
      $target,
    });
  }

  setState(nextData) {
    // console.log('data', nextData);
    this.data = nextData;
    this.searchResult.setState(nextData);
  }
}
