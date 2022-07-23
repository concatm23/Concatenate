/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 13:54:07
 * @LastEditTime    : 2022-07-23 16:43:13
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-resources\lib\sdk.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
//app sdk

const nodeRequireMenu = function (path) {
    //auto set require path
    return window.nodeRequire(`${localStorage.getItem('node_modules_position')}${path}`)
};

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
            ), options, function (err, data) {
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
const ipcRenderer = ((window.nodeRequire || window.require || console.log)('electron') || {}).ipcRenderer;
const RPC = nodeRequireMenu('@electron/remote'); //remote
function getConfig(category, callback) {
    return new Promise(function (resolve, reject) {
        var data = RPC.getGlobal('config_ptr').config;
        if (category === '.' || category === '');
        else data = data[category] || {};
        if (callback) callback(data);
        resolve(data);
    });
};
function getModulePath(name, callback) {
    return new Promise(function (resolve, reject) {
        var data = localStorage.getItem('node_modules_position') + name;
        if (callback) callback(data);
        resolve(data);
    });
};

var _listeners = {};
function on(e, func) {
    if (!_listeners[e]) _listeners[e] = [];
    _listeners[e].push(func);
};
function publish(e, ...data) {
    if (!_listeners[e]) return;
    for (var i = 0, len = _listeners[e].length; i < len; ++i) _listeners[e][i](...data);
};
function off(e, func) {
    if (!_listeners[e]) return;
    for (var i = 0, len = _listeners[e].length; i < len; ++i) if (_listeners[e][i] == func) _listeners[e].splice(i, 1);
};
function once(e, func) {
    function runOnlyOnce(...data) {
        func(...data);
        off(e, runOnlyOnce);
    };
    on(e, runOnlyOnce);
};

function inChinaSync() {
    //check user whether in China
    try {
        if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
        else var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', 'https://google.com/recaptcha/api.js', false);
        xhr.send();
    } catch (e) {
        console.error(e);
        return true;
    }

    if (xhr.readyState == 4) {
        //visit successfully
        return false;
    } else return true;
};
function inChina() {
    //check user whether in China
    return new Promise(function (resolve, reject) {
        try {
            if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
            else var xhr = new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open('GET', 'https://google.com/recaptcha/api.js', true);
            xhr.send();
            xhr.ontimeout = function () { resolve(true); };
            xhr.onabort = function () { resolve(true); };
            xhr.onerror = function () { resolve(true); };
        } catch (e) {
            console.error(e);
            return resolve(true);
        }
        xhr.onload = function () {
            if (xhr.readyState == 4) {
                //visit successfully
                resolve(false);
            } else resolve(true);
        };

    });
};

ipcRenderer.on('msg', function (e, data) {
    console.info('Received data from server', data);
})

const _do_code_cache = new Map();
const remote = {
    do: function (keyname, ...args) {
        const CODE_CACHE_EXPIRE_TIME = 10 * 60 * 1000; //10min
        if (_do_code_cache.has(keyname)) {
            //in cache
            var code = _do_code_cache.get(keyname);
            if (new Date().getTime() - code.time > CODE_CACHE_EXPIRE_TIME) {
                //cache expired
                _do_code_cache.delete(keyname);
                return remote.do(keyname, args);
            };
            //run
            return new Promise(async function (resolve, reject) {
                const ret_value = await code.func(...args);
                resolve(ret_value);
            });
        } else {
            try {
                var func = fRequire('FaaS/' + keyname + '.js');
            } catch (e) {
                var func = fRequire('../FaaS/' + keyname + '.js'); //for sub directories
            };
            //include functions

            _do_code_cache.set(keyname, {
                time: new Date().getTime(),
                func: func
            }); //set cache
            return remote.do(keyname, func); //run
        };
    }
};

module.exports = {
    env: 'app',
    platform: navigator.platform.toLowerCase(),
    fs: fs,
    getConfig: getConfig,
    getModulePath,
    on: on,
    off: off,
    once: once,
    addEventListener: on,
    removeEventListener: off,
    publish: publish,
    inChinaSync,
    inChina,
    remote,
    nodeRequire: nodeRequireMenu
};