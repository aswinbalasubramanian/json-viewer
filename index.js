const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
});

ipcMain.handle('open-file', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Supported Files', extensions: ['json', 'txt', 'csv', 'xml'] },
      { name: 'All Files', extensions: ['*'] }
    ],
  });

  if (filePaths.length > 0) {
    let rawContent = fs.readFileSync(filePaths[0], 'utf-8'); // Ensure UTF-8 encoding
    rawContent = rawContent.replace(/\uFEFF/g, ''); // Remove BOM characters
    console.log("File Content:", rawContent); // Debugging - log file content
    return {
        content: rawContent,
        extension: path.extname(filePaths[0]).toLowerCase()
    };
}
  return null;
});
