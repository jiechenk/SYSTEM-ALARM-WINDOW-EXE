const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readSettings: () => ipcRenderer.invoke('read-settings'),
  writeSettings: (data) => ipcRenderer.invoke('write-settings', data),
  selectAudioFile: () => ipcRenderer.invoke('select-audio-file')
});
