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
  /*win.on('close', (event) => {
    event.preventDefault()
    let options = {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: 'Are you sure you want to quit?'
          //cancelId: 1
        }
    var choice = dialog.showMessageBox(win, options);
    if(choice == 0){
      win.destroy();
      //app.quit;
      //win = null;
    }
    //dialog.showMessageBox(win, options, (res) => {
      //console.log(res);
      //console.log(checked);
      //if (res == 1){
        //event.preventDefault()
        //Yes button pressed
        //win.destroy();
        //win = null;
        //app.quit();
  })*/
  win.loadFile('index.html')
  win.setMenu(null)
  // Open the DevTools.
  win.once('ready-to-show', () => {
    win.show()
  })
  //win.webContents.openDevTools()
  //win.on('closed', () => {
  	//console.log("closed");
    //win = null;
    //app.quit();
 	//})
 //Listen close event to show dialog message box
	
  	//})
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
    //twoFactorCode: SteamTotp.generateAuthCode(config.bot2.sharedSecret)
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
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

