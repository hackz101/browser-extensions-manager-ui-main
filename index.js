const extensionGrid = document.querySelector('.extension-grid');

async function loadExtensions() {
  try {
    const fetchResponse = await fetch('data.json');

    if (!fetchResponse.ok) {
      throw new Error("Failed to load JSON");
    }

    const data = await fetchResponse.json();
    const grid = document.querySelector('.extension-grid');

    //load in cards
    data.forEach((extensionData) => {
      const extension = generateExtension(extensionData);
      
      extensionGrid.insertAdjacentElement('beforeend', extension);
    });

  } catch (error) {
    console.error('Couldn\'t load data.', error);
  }
}

document.addEventListener('DOMContentLoaded', loadExtensions);

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
      <input type="checkbox" class="active-toggle">
    </div>
  `);

  return extension;
}