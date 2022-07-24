/**
 * @Author          : lihugang
 * @Date            : 2022-05-17 14:41:01
 * @LastEditTime    : 2022-07-24 13:43:13
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\main.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const electron = require('electron'); // Electron web app
const fs = require('fs'); //FileSystem
const yaml = require('js-yaml'); //yaml parser
const { fetch, makeRequest, logger, StringBuilder, download_file } = require('./common.js');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const dialog = electron.dialog;
const remote = require('@electron/remote/main');
const ws = require('ws'); //Web socket
const crypto = require('crypto'); //Crypto
const path = require('path'); //path process
const pkgID = 'pz6w7nkeote'; //Package ID
const ptrObject = function (obj = {}) {
    for (var key in obj) this[key] = obj[key];
};
// In JavaScript, passing a string or an integer, etc. is a copy value, and passing an object is a copy pointer,
// and the object can be modified through the pointer within the function, 
//but the original string or integer cannot be modified. 
//So, encapsulate a string or integer into an object to pass it

var mainWindow = null; //Electron main window
var mainWindow_ptr = new ptrObject({
    mainWindow
});

const __resourcePath = (process.argv.indexOf('--fs') != -1 || true) ? __dirname : `${__dirname}/resources/app.asar`;

const __debugFlag = (process.argv.indexOf('--debug') != -1) ? true : false;

const __usrDir = path.join(process.env.APPDATA, `concatenate.${pkgID}`); //%APPDATA%/concatenate.${pkgID}
const __storePath = path.join(process.env.APPDATA, `concatenate.${pkgID}`, 'dat'); //%APPDATA%/concatenate.${pkgID}/dat
const __update_resource_path = path.join(process.env.APPDATA, `concatenate.${pkgID}`, (process.argv.indexOf('--fs') != -1) ? 'resources' : 'resources.asar'); // Use directory 'resources' instead of 'resources.asar' in fs arg mode
global.resourcePath = __update_resource_path; //for RPC
//Debug Mode:
//%APPDATA%/concatenate.${pkgID}/resources/
//Normal Mode:
//%APPDATA%/concatenate.${pkgID}/resources.asar (in one file)

const initLogger = new logger('init');
if (__debugFlag) initLogger.filter(logger.ALL);
//debug mode, print all logs

remote.initialize(); //initialize the remote module in Electron

async function init() {
    initLogger.info('Initial software');
    var res = void 0;
    var callee = [
        require(path.join(
            __resourcePath,
            'routers',
            'init_folder.js'
        )),
        require(path.join(
            __resourcePath, 
            'routers',
            'check_internet.js'
        )),
        require(path.join(
            __resourcePath,
            'routers',
            'create_window.js'
        )),
        require(path.join(
            __resourcePath,
            'routers',
            'create_tray.js'
        )),
        require(path.join(
            __resourcePath,
            'routers',
            'read_config.js'
        )),
        require(path.join(
            __resourcePath,
            'routers',
            'download_package.js'
        )),
        require(path.join(
            __resourcePath,
            'routers',
            'load_service.js'
        ))
    ];
    //require tasks that setup will be used
    //Init Folder -> Check Internet -> Create Window -> Create Tray -> Read Config -> Download Package Resources -> Load Service
    for (var i = 0; i < callee.length; i++) {
        initLogger.info('Call function',callee[i]);
        res = await callee[i](res, {
            __resourcePath,
            __debugFlag,
            pkgID,
            __usrDir,
            __storePath,
            __update_resource_path,
            isOnline_ptr,
            init_status_ptr,
            mainWindow_ptr,
            config_ptr,
            app,
            BrowserWindow,
            Menu,
            Tray,
            fetch,
            yaml,
            download_file,
            logger: initLogger,
            Logger: logger,
            remote,
        });
    };
};

const key = app.requestSingleInstanceLock(); //signal instance
if (!key) {
    new logger('check').info('Failed to get Signal Instance Lock');
    app.quit(); //get lock failed, one more instances
} else {
    new logger('check').info('Get Signal Instance Lock');
    app.on('ready',init); 
    app.on('window-all-closed', () => {
        app.quit();
    })
};




var init_status_ptr = new ptrObject({
    init_status: false
});
var isOnline_ptr = new ptrObject({
    online: null
});
var config_ptr = new ptrObject({
    config: {}
});
global.config_ptr = config_ptr;

//bug report
process.on('uncaughtException',async (err) => {
    //something error
    (new logger('setup')).error(err);
    const bug_report_uri = 'https://log-concatenate.deta.dev';
    await fetch(bug_report_uri, { 
        method: 'POST',
        body: JSON.stringify({
            type: 'client',
            level: 'error',
            data: {
                message: err.message,
                stack: err.stack
            }
        })
    });
    dialog.showErrorBox('Error', err.message);
    process.exit(1);
});

process.on('unhandledRejection', async (reason,promise) => {
    //something error
    (new logger('setup')).error(reason);
    const bug_report_uri = 'https://log-concatenate.deta.dev';
    await fetch(bug_report_uri, {
        method: 'POST',
        body: JSON.stringify({
            type: 'client',
            level: 'error',
            data: reason
        })
    });
    dialog.showErrorBox('Error', reason.toString());
    process.exit(1);
});
