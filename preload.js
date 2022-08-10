const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {

  //electron's code

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  //call app close handler, from index.js, using ipcRenderer

  document.querySelector('body').addEventListener('click', () => {
    ipcRenderer.invoke('quit-app');
  });

})
