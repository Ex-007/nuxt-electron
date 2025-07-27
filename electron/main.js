const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { logDownload } = require('../utils/update-tracker');

const isDev = !app.isPackaged;
app.disableHardwareAcceleration();

let win;

if (!isDev) {
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'Ex-007',    // Replace with your GitHub username
    repo: 'repo',           // Replace with your repository name
    private: false,                   // Set to true if private repo
    releaseType: 'release'            // Use 'release' for stable releases
  });
  
  // Configure logging
  autoUpdater.logger = require('electron-log');
  autoUpdater.logger.transports.file.level = 'info';
  
  // Auto-updater will look for assets named like:
  // sales-point-win32-x64.zip (Windows)
  // sales-point-darwin-x64.zip (macOS)  
  // sales-point-linux-x64.tar.gz (Linux)
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    resizable: true,
    // icon: path.join(__dirname, '..', 'build', 'icon.png'), use your icon path and name
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenu(null);

  const staticPath = path.join(__dirname, '..', '.output', 'public');
  const indexPath = path.join(staticPath, 'index.html');

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(indexPath);
  }

  if (isDev) win.webContents.openDevTools();

  // Setup auto-updater (only in production)
  if (!isDev) {
    setupAutoUpdater();
  }
}

function setupAutoUpdater() {
  // Check for updates 5 seconds after app starts
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 5000);

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Checking for Update',
      message: 'Checking for updates...',
      buttons: ['OK']
    });
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info);
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Update Available',
      message: `A new version (${info.version}) is available and will be downloaded in the background.`,
      buttons: ['OK']
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available. Current version:', info.version);
  });

  autoUpdater.on('error', (err) => {
    console.error('Error checking for updates:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.round(progressObj.percent);
    console.log(`Download progress: ${percent}%`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info);
    logDownload(info.version);
    
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Update Ready',
      message: `Version ${info.version} has been downloaded. Restart the application to apply the update.`,
      buttons: ['Restart Now', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC CONFIG Handling


// Manual update check
ipcMain.on('manual-update-check', () => {
  if (!isDev) {
    console.log('Manual update check requested');
    autoUpdater.checkForUpdatesAndNotify();
  }
});

// IPC FOR MINIMIZING, MAXIMIZING AND CLOSING THE WINDOW FOR A CUSTOM MENU BAR
ipcMain.on('minimize', () => win?.minimize());
ipcMain.on('maximize', () => (win?.isMaximized() ? win.unmaximize() : win.maximize()));
ipcMain.on('close', () => win?.close());