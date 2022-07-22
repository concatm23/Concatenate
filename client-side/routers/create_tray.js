/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 10:50:06
 * @LastEditTime    : 2022-07-22 10:55:53
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\routers\create_tray.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 10:24:26
 * @LastEditTime    : 2022-07-22 10:36:12
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\routers\create_window.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const path = require('path');
module.exports = async function create_tray (void_args , map) {
    return new Promise(function (resolve, reject) {
        const { logger, Tray, Menu, app, __resourcePath, mainWindow_ptr } = map;
        const tray = new Tray(path.join(
            __resourcePath,
            'icon.ico'
        ));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Exit',
                click: () => {
                    logger.info('Receive signal: Quit Application, user clicked.');
                    mainWindow_ptr.mainWindow.destroy();
                    app.quit();
                    process.exit(0);
                }
            }
        ]);
        tray.setToolTip('Concatenate');
        tray.setContextMenu(contextMenu);
        tray.on('click', () => {
            if (mainWindow_ptr.mainWindow.isVisible()) { //can see
                logger.info('Receive signal: Hide Application, user clicked.');
                mainWindow_ptr.mainWindow.hide();
                mainWindow_ptr.mainWindow.setSkipTaskbar(false);
            } else { //hide
                logger.info('Receive signal: Show Application, user clicked.');
                mainWindow_ptr.mainWindow.show();
                mainWindow_ptr.mainWindow.setSkipTaskbar(true);
            }
        });
        resolve();
    });
};