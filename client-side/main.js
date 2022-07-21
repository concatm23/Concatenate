/**
 * @Author          : lihugang
 * @Date            : 2022-05-17 14:41:01
 * @LastEditTime    : 2022-07-21 22:57:32
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \git-rebuild\Concatenate\client-side\main.js
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
const { fetch, makeRequest, logger, StringBuilder } = require('./common.js');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ia = require('internet-available'); //Check internet connected
const ws = require('ws'); //Web socket
const crypto = require('crypto'); //Crypto
const path = require('path'); //path process
const pkgID = 'pz6w7nkeote'; //Package ID

var mainWindow = null; //Electron main window

const __resourcePath = (process.argv.indexOf('--fs') != -1) ? __dirname : `${__dirname}/resources/app.asar`;
const __debugFlag = (process.argv.indexOf('--debug') != -1) ? true : false;

const __usrDir = path.join(process.env.APPDATA, `concatenate.${pkgID}`); //APPDATA
const __storePath = path.join(process.env.APPDATA, `concatenate.${pkgID}`, 'dat');
const __update_resource_path = path.join(process.env.APPDATA, `concatenate.${pkgID}`, (process.argv.indexOf('--fs') != -1) ? 'resources' : 'resources.asar'); // Use directory 'resources' instead of 'resources.asar' in fs arg mode

async function init() {
    var res = void 0;
    var callee = [
        require(path.join(
            __resourcePath,
            'routers',
            'init_folder.js'
        ))
    ];
    for (var i = 0; i < callee.length; i++) {
        res = await callee[i](res, {
            resourcePath: __resourcePath,
            __debugFlag,
            pkgID,
            __usrDir,
            __storePath,
            __update_resource_path
        });
    };
};

init();


var init_status = false;
var isOnline = null;
global.config = {};

