const body = document.querySelector('body');
const themeToggle = document.querySelector('.theme-icon');
console.log(themeToggle);
const extensionGrid = document.querySelector('.extension-grid');
let data = [];

document.addEventListener('DOMContentLoaded', loadExtensions);

themeToggle.addEventListener('click', () => {
  const isDarkMode = body.classList.contains('dark');

  if (isDarkMode) {
    body.classList.remove('dark');
    themeToggle.src = './assets/images/icon-moon.svg';
  } else {
    body.classList.add('dark');
    themeToggle.src = './assets/images/icon-sun.svg';
  }
});

document.body.addEventListener('touchstart', () => {}, { passive: true });

async function loadExtensions() {
  try {
    const fetchResponse = await fetch('data.json');

    if (!fetchResponse.ok) {
      throw new Error("Failed to load JSON");
    }

    data = await fetchResponse.json();
    const grid = document.querySelector('.extension-grid');

    //load in cards
    data.forEach((extensionData) => {
      const extension = generateExtension(extensionData);

      //handle remove
      extension.querySelector('.remove-button').addEventListener('click', () => {
        removeExtension(extensionData.name);
      });

      //handle active toggle
      extension.querySelector('.slider').addEventListener('click', () => {
        toggleActivity(extensionData.name);
      });

      extensionGrid.insertAdjacentElement('beforeend', extension);
    });

    //set filter listeners after data load
    const allFilter = document.querySelector('#all-filter');
    const activeFilter = document.querySelector('#active-filter');
    const inactiveFilter = document.querySelector('#inactive-filter');
    

    allFilter.addEventListener('click', () => {
      //change filter styles
      const currentFilter = document.querySelector('.active-filter');
      currentFilter.classList.remove('active-filter');
      allFilter.classList.add('active-filter');

      //reset all extensions
      const allExtensions = Array.from(extensionGrid.children);
      allExtensions.forEach((extension) => {
        extension.style.display = 'flex';
      });
    });

    activeFilter.addEventListener('click', () => {
      //change filter styles
      const currentFilter = document.querySelector('.active-filter');
      currentFilter.classList.remove('active-filter');
      activeFilter.classList.add('active-filter');

      //reset all extensions
      const allExtensions = Array.from(extensionGrid.children);
      allExtensions.forEach((extension) => {
        extension.style.display = 'flex';
      });

      //hide inactive extensions
      const inactiveExtensions = data.filter(extension => extension.isActive === false);
      inactiveExtensions.forEach((inactiveExtension) => {
        const extToHide = allExtensions.find(extension => extension.querySelector('.extension-name').innerText === inactiveExtension.name);
        extToHide.style.display = 'none';
      });
    });

    inactiveFilter.addEventListener('click', () => {
      //change filter styles
      const currentFilter = document.querySelector('.active-filter');
      currentFilter.classList.remove('active-filter');
      inactiveFilter.classList.add('active-filter');

      //reset all extensions
      const allExtensions = Array.from(extensionGrid.children);
      allExtensions.forEach((extension) => {
        extension.style.display = 'flex';
      });

      //hide active extensions
      const activeExtensions = data.filter(extension => extension.isActive === true);
      activeExtensions.forEach((activeExtension) => {
        const extToHide = allExtensions.find(extension => extension.querySelector('.extension-name').innerText === activeExtension.name);
        extToHide.style.display = 'none';
      });
    });

  } catch (error) {
    console.error('Couldn\'t load data.', error);
  }
}

function generateExtension(extensionData) {
  const extension = document.createElement('section');

  extension.classList.add('extension');

  extension.insertAdjacentHTML('beforeend', `
    <div class="extension-info">
      <img src="${extensionData.logo}" alt="Extension Icon" class="extension-icon">
      <div class="extension-main-info">
        <h2 class="extension-name">${extensionData.name}</h2>
        <p class="extension-description">${extensionData.description}</p>
      </div>
    </div>
    <div class="extension-ctrl-bar">
      <button class="remove-button">Remove</button>
      <label class="active-toggle" tabIndex="0">
        <input type="checkbox" class="toggle-checkbox" tabIndex="-1" ${extensionData.isActive ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
  `);

  return extension;
}

function removeExtension(name) {
  //remove from data
  const index = data.findIndex(extension => extension.name === name);
  data.splice(index, 1);
  
  //remove from screen
  const elementToRemove = extensionGrid.children[index];
  extensionGrid.removeChild(elementToRemove);
}

function toggleActivity(name) {
  const extToToggle = data.find(extension => extension.name === name);
  extToToggle.isActive = !extToToggle.isActive;
}