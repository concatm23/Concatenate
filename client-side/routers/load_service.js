/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 13:25:26
 * @LastEditTime    : 2022-07-22 16:59:11
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\routers\load_service.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const path = require('path');
module.exports = async function(void_args, map) {
    const { Logger, mainWindow_ptr, __update_resource_path } = map;
    const logger = new Logger('service');
    logger.info('Service started.');

    //load index page
    mainWindow_ptr.mainWindow.loadURL(path.join(
        __update_resource_path, 
        'index.html'
    ));
    //resources/index.html
    logger.info('Load URL: ' , path.join(__update_resource_path, 'index.html'));
    const func = require(path.join(
        __update_resource_path,
        'backend',
        'index.js'
    )); //call control functions in resources pack
    func(map);
};