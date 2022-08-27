/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 16:08:33
 * @LastEditTime    : 2022-07-23 19:38:51
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\backend\index.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const fs = require('fs');
const path = require('path');

module.exports = function (map) {

    const { Logger } = map;

    const msgLogger = new Logger('ipcChannel');

    msg_process(msgLogger, map);
};

function msg_process(logger, map) {
    const ipcMain = require('electron').ipcMain;
    const { __storePath } = map;

    // const func_map = new Map([
    //     ['get-config', get_config_func],
    //     ['get-module-path', get_module_path_func]
    // ]);

    // ipcMain.on('msg', function (e, data) {
    //     logger.info('Get message:', data.type, data.data);
    //     var run_func = func_map.get(data.type);
    //     run_func(e.reply, data.data);
    // });

    // function send(func, data) {
    //     try {
    //         func(data);
    //     } catch (e) {
    //         logger.error(e);
    //     }

    // };

    // function get_config_func(func, msg) {
    //     const data = map.config_ptr.config;
    //     if (msg == '' || msg == '.') {
    //         logger.info('Config message send');
    //         send(func,{
    //             type: 'get-config',
    //             data: data
    //         });
    //     }
    //     else {
    //         logger.info('Config message send', data[msg]);
    //         send(func,{
    //             type: 'get-config',
    //             data: data[msg] || {}
    //         });
    //     };
    // };

    // function get_module_path_func(func, msg) {
    //     if (msg != 'common') {
    //         //common modules
    //         send(func,{
    //             type: 'get-module-path',
    //             data: path.join(
    //                 __dirname.replaceAll('\\', '/'),
    //                 'common.js'
    //             )
    //         });
    //     } else
    //         send(func,{
    //             type: 'get-module-path',
    //             data: path.join(
    //                 __dirname.replaceAll('\\', '/'),
    //                 'node_modules',
    //                 msg
    //             )
    //         });
    //     logger.info('Module path message send');
    // };

    //Using RPC instead of message channel
};