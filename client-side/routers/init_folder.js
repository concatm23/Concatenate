/**
 * @Author          : lihugang
 * @Date            : 2022-07-21 22:10:09
 * @LastEditTime    : 2022-07-22 16:58:59
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\routers\init_folder.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const fs = require('fs');
module.exports = async function init_folder (void_arg, map) {
    const {
        __usrDir,
        __storePath,
    } = map;
    return new Promise((resolve, reject) => {
        fs.mkdir(__usrDir, (err) => {
            //%appdata%/concatenate.xxx
            if (err) return resolve(false);
            fs.mkdir(__storePath, (err) => {
                //%appdata%/concatenate.xxx/dat
                if (err) return resolve(false);
                resolve(true);
            });
        });
    });

};