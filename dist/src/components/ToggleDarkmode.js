class ToggleDarkmode {
  constructor({ $target }) {
    // $target : div#App, this: ToggleDarkmode{}
    const $toggleDarkmode = document.createElement('label');
    $toggleDarkmode.className = 'darkmode-switch';

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');

    const span = document.createElement('span');
    span.className = 'slider';

    $toggleDarkmode.appendChild(input);
    $toggleDarkmode.appendChild(span);

    $target.appendChild($toggleDarkmode);

    // check for saved userThemeMode in localstorage
    let userThemeMode = localStorage.getItem('userThemeMode');
    let hasOsMode = localStorage.getItem('osMode');
    // If the user already visited and enabled darkMode
    // start things off with it on
    if (
      (hasOsMode === 'null' && userThemeMode === 'dark') ||
      userThemeMode === 'dark'
    ) {
      this.onToggle().enableDarkMode();
      input.checked = 'true';
    }

    let osMode =
      !!window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (osMode || (osMode && userThemeMode === 'light')) {
      localStorage.setItem('osMode', 'on');
      this.onToggle().enableDarkMode();
      input.checked = 'true';
    } else if (!osMode && userThemeMode === 'dark' && hasOsMode === 'on') {
      localStorage.setItem('osMode', null);
      this.onToggle().disableDarkMode();
      input.checked = 'false';
    }

    $toggleDarkmode.addEventListener('change', (e) => {
      if (e.target.checked) {
        this.onToggle().enableDarkMode();
      } else {
        this.onToggle().disableDarkMode();
      }
    });
  }

  onToggle() {
    const enableDarkMode = () => {
      // 1. Add the class to the body
      document.querySelector('html').classList.add('darkmode');
      // 2. Update darkMode in localStorage
      localStorage.setItem('userThemeMode', 'dark');
    };
    const disableDarkMode = () => {
      // 1. Remove the class from the body
      document.querySelector('html').classList.remove('darkmode');
      // 2. Update darkMode in localStorage
      localStorage.setItem('userThemeMode', 'light');
    };
    return { enableDarkMode, disableDarkMode };
  }
}
