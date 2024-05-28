const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  /*** * * ***/

  document.querySelector('body').addEventListener('dblclick', () => {
    ipcRenderer.invoke('dblclick');
  });

  document.querySelector('#close-btn').addEventListener('click', () => {
    ipcRenderer.invoke('quit-app');
  });

})
