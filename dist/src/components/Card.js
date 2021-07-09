class Card {
  constructor({ $target, data }) {
    this.$card = document.createElement('figure');
    this.$card.className = 'card';
    this.$card.dataset.id = data.id;
    this.data = data;

    $target.appendChild(this.$card);

    this.render();
  }

  render() {
    if (this.data.name === undefined || this.data.name === null) {
      this.data.name = 'none';
    }

    const { url, name } = this.data;

    const cardImage = document.createElement('img');
    cardImage.className = 'card-image';
    cardImage.classList.add('lazy');
    cardImage.src = 'https://via.placeholder.com/293/FFFFFF/FFFFFF';
    cardImage.dataset.src = url;
    cardImage.alt = name;

    const cardOverlay = document.createElement('div');
    cardOverlay.className = 'card-overlay';

    const noScript = document.createElement('noscript');
    const nolazyCardImage = document.createElement('img');
    nolazyCardImage.src = url;
    noScript.appendChild(nolazyCardImage);

    const cardTitle = document.createElement('figcaption');
    cardTitle.className = 'card-title';
    cardTitle.textContent = name;

    this.$card.appendChild(cardImage);
    this.$card.appendChild(cardOverlay);
    this.$card.appendChild(noScript);
    this.$card.appendChild(cardTitle);
  }
}
