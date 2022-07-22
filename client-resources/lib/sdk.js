/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 13:54:07
 * @LastEditTime    : 2022-07-22 18:46:39
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
    read: async function (fpath, options, callback) {
        return new Promise((resolve, reject) => {
            const filesystem = nodeRequire('fs');
            const path = nodeRequire('path');
            //local api
            filesystem.readFile(path.join(
                __dirname,
                '../',
                'dat',
                fpath
            ), options, function(err,data) {
                if (err) return reject('File is not exists or it is not readable.');
                if (callback) callback(data.toString());
                resolve(data.toString());
            });
        });
    },
    readSync: function (fpath, options, callback) {
        const filesystem = nodeRequire('fs');
        const path = nodeRequire('path');
        //local api
        const content = filesystem.readFileSync(path.join(
            __dirname,
            '../',
            'dat',
            fpath
        ), options).toString();
        if (callback) callback(content);
        return content;
    },
    write: async function (fpath, options, data, callback) {
        return new Promise((resolve, reject) => {
            const filesystem = nodeRequire('fs');
            const path = nodeRequire('path');
            //local api
            filesystem.writeFile(path.join(
                __dirname,
                '../',
                'dat',
                fpath
            ), data, options, function (err) {
                if (err) return reject('File is not exists or it is not writable.');
                if (callback) callback();
                resolve();
            });
        });
    },
    writeSync: function (fpath, options, data, callback) {
        const filesystem = nodeRequire('fs');
        const path = nodeRequire('path');
        //local api
        filesystem.writeFileSync(path.join(
            __dirname,
            '../',
            'dat',
            fpath
        ), data, options);
        if (callback) callback();
        return;
    },
};
function getConfig(category, callback) {
    return new Promise(function (resolve, reject) {
        ipcRenderer.send('get-config', category);
        ipcRenderer.once('get-config', function (e, data) {
            if (callback) callback(data);
            resolve(data);
        });
    });
};
function getConfigSync(category, callback) {
    var data = ipcRenderer.sendSync('get-config', category);
    if (callback) callback(data);
    return data;
};
var _listeners = {};
function on(e, func) {
    if (!_listeners[e]) _listeners[e] = [];
    _listeners[e].push(func);
};
function publish(e, ...data) {
    for (var i = 0, len = _listeners[e].length; i < len; ++i) _listeners[e][i](...data);
};
function inChina() {
    //check user whether in China
    if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
    else var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET','https://google.com/recaptcha/api.js',false);
    xhr.send();
    if (xhr.readyState == 4) {
        //visit successfully
        return false;
    } else return true;
};
module.exports = {
    env: 'app',
    platform: navigator.platform.toLowerCase(),
    fs: fs,
    getConfig: getConfig,
    getConfigSync: getConfigSync,
    on: on,
    publish: publish,
    inChina: inChina
};