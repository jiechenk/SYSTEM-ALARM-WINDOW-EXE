const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: "System Alarm Lapangan",   // 🟢 Judul aplikasi
    icon: path.join(__dirname, 'icon.ico'), // 🟢 Gunakan icon.ico (bukan .png)
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('wind-alarm.html');

  // Opsional: buka DevTools hanya saat debug
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Tutup aplikasi sepenuhnya saat semua window ditutup
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});


// ===== HANDLER IPC UNTUK SETTINGS =====
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

ipcMain.handle('read-settings', async () => {
  if (await fs.pathExists(settingsPath)) {
    return await fs.readJSON(settingsPath);
  } else {
    return {};
  }
});

ipcMain.handle('write-settings', async (event, data) => {
  await fs.writeJSON(settingsPath, data, { spaces: 2 });
});

ipcMain.handle('select-audio-file', async () => {
  const result = await dialog.showOpenDialog(win, {
    title: 'Pilih File Audio',
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }
    ],
    properties: ['openFile']
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});
