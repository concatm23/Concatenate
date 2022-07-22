/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 13:54:07
 * @LastEditTime    : 2022-07-22 16:03:38
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\lib\sdk.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
//app sdk
const fs = {
    read: async function(path) {
        return new Promise((resolve, reject) => {

        })
    }
};
function getConfig(category, callback) {
    return new Promise(function(resolve,reject) {
        ipcRenderer.send('get-config',category);
        ipcRenderer.once('get-config', function(data) {
            if (callback) callback(data);
            resolve(data);
        });
    });
};
module.exports = {
    env: 'app',
    platform: navigator.platform.toLowerCase(),
    fs: fs,
    getConfig: getConfig,
}