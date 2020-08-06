var { app, BrowserWindow, dialog } = require('electron')
var { remote } = require('electron');
const SteamUser = require('steam-user');
const SteamTotp =require('steam-totp');
const client = new SteamUser();
const {ipcMain} = require('electron');

function createWindow(){
	const win = new BrowserWindow({
    frame: true,
    width: 800,
    height: 600,
    resizable: true,
    icon: __dirname + '/resources/logo_64.ico' ,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('index.html')
  win.setMenu(null)
  // Open the DevTools.
  win.once('ready-to-show', () => {
    win.show()
  })
  //win.webContents.openDevTools()
}
  
app.whenReady().then(createWindow)
ipcMain.on('start', (event, arg) => {
  
  var name  = arg.message;
  var pass = arg.someData;
  var auth = arg.authcode;
  var gameid = parseInt(arg.gameid);
  const logOnOptions = {
    accountName: name,
    password: pass,
    twoFactorCode: auth
    };
  client.logOn(logOnOptions);
  client.on('loggedOn', () => {
          console.log('Logged into Steam');
          client.setPersona(SteamUser.EPersonaState.Online)
          client.setPersona(SteamUser.EPersonaState.Online, 'csgoXchangeBot#1');
          client.gamesPlayed(gameid);
    });
});

ipcMain.on('stop', (event)=>{
	client.logOff();
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

