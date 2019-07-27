import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@advanced-rest-client/arc-data-export/arc-data-export.js';
import '../export-panel.js';

document.getElementById('theme').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});
document.getElementById('styled').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('styled');
  } else {
    document.body.classList.remove('styled');
  }
});
/* global Promise */
function _fileExportHandler(e) {
  e.preventDefault();
  e.detail.result = new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
  document.getElementById('fileToast').opened = true;
  console.log(e.detail);
}

function _driveExportHandler(e) {
  e.preventDefault();
  e.detail.result = new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
  document.getElementById('driveToast').opened = true;
  console.log(e.detail);
}

window.addEventListener('file-data-save', _fileExportHandler);
window.addEventListener('google-drive-data-save', _driveExportHandler);
