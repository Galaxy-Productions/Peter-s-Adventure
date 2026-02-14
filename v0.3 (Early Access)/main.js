const { app, BrowserWindow } = require('electron');
const path = require('path');
const DiscordRPC = require('discord-rpc');

const clientId = '1461755961814421596';

// Register the client ID immediately
DiscordRPC.register(clientId);

let rpc;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'PETER_DATA', 'icon.png'),
        autoHideMenuBar: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, 'PETER_DATA', 'index.html'));

    // Handle F11 for fullscreen toggle
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F11' && input.type === 'keyDown') {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
            event.preventDefault();
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // Initialize Discord RPC
    rpc = new DiscordRPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
        console.log('Discord RPC Ready');
        rpc.setActivity({
            details: 'Playing Peter\'s Adventure',
            startTimestamp: new Date(),
            largeImageKey: 'icon',
            largeImageText: 'Peter\'s Adventure',
            instance: false,
        });
    });

    rpc.login({ clientId }).catch(console.error);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
