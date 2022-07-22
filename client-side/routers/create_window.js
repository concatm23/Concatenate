/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 10:24:26
 * @LastEditTime    : 2022-07-22 16:57:34
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : e:\concatenate\git-rebuild\Concatenate\client-side\routers\create_window.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const fs = require('fs');
const path = require('path');
module.exports = async function create_window(info, map) {
    return new Promise(function (resolve, reject) {
        const { logger, __debugFlag, __resourcePath, Menu, BrowserWindow, mainWindow_ptr } = map;
        try {
            var options = JSON.parse(fs.readFileSync(path.join(__resourcePath, 'config', 'window.json')));
            //read json config for the main window
            // ./config/window.json
        } catch (e) {
            logger.error(e);
            logger.error('Cannot read or parse ./config/window.json');
            reject('Cannot read or parse ./config/window.json');
        };

        Menu.setApplicationMenu(null); //No app menu
        mainWindow_ptr.mainWindow = new BrowserWindow(
            options
        );// Create Window
        logger.info('Create Main Window', 'width = ', options.width, 'height = ', options.height);
        if (__debugFlag)
            mainWindow_ptr.mainWindow.webContents.openDevTools();

        //show loading page
        mainWindow_ptr.mainWindow.loadURL(path.join(__resourcePath, 'static-html', 'loading.html?Loading'));

        mainWindow_ptr.mainWindow.on('close', function (e) {
            e.preventDefault();
            mainWindow_ptr.mainWindow.hide();
            mainWindow_ptr.mainWindow.setSkipTaskbar(true);

            //prevent closing

        });
        resolve();
    });
};