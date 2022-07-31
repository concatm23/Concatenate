/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 13:54:07
 * @LastEditTime    : 2022-07-31 11:56:43
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
const env = 'app';
const appId = 'pz6w7nkeote';

const nodeRequireMenu = function (path) {
    //auto set require path
    if (path == 'common') return window.nodeRequire(`${localStorage.getItem('node_modules_position')}../common.js`); //common functions with frontend and backend
    return window.nodeRequire(`${localStorage.getItem('node_modules_position')}${path}`);
};


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
function getResourcePath(callback) {
    return new Promise(function (resolve, reject) {
        var data = RPC.getGlobal('resourcePath') + '/';
        if (callback) callback(data);
        resolve(data);
    });
};
function getResourcePathSync(callback) {
    var data = RPC.getGlobal('resourcePath') + '/';
    if (callback) callback(data);
    return data;
};
function getModulePath(name, callback) {
    return new Promise(function (resolve, reject) {
        var data = localStorage.getItem('node_modules_position') + name;
        if (callback) callback(data);
        resolve(data);
    });
};

var _listeners = {};
const common = nodeRequireMenu('common');
const event_logger = new common.logger('SDK event bus');
function on(e, func) {
    if (!_listeners[e]) _listeners[e] = [];
    //limit listeners
    if (_listeners[e].length > 20) {
        event_logger.error('too much listeners on event', e);
        return;
    };
    _listeners[e].push(func);
};
function publish(e, ...data) {
    event_logger.info('Emit event', e);
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


const fs = {
    read: async function (fpath, options, callback) {
        return new Promise(async (resolve, reject) => {
            const filesystem = nodeRequire('fs');
            const path = nodeRequire('path');
            //local api
            const basePath = await getResourcePath();
            filesystem.readFile(path.join(
                basePath,
                '../',
                'dat',
                fpath
            ), options, function (err, data) { //read from concatenate.xxxx/dat
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
            getResourcePathSync(),
            '../',
            'dat',
            fpath
        ), options).toString();//read from concatenate.xxxx/dat
        if (callback) callback(content);
        return content;
    },
    write: async function (fpath, options, data, callback) {
        return new Promise(async (resolve, reject) => {
            const filesystem = nodeRequire('fs');
            const path = nodeRequire('path');
            //local api
            const basePath = await getResourcePath();
            filesystem.writeFile(path.join(
                basePath,
                '../',
                'dat',
                fpath
            ), data, options, function (err) { //write to concatenate.xxxx/dat
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
            getResourcePathSync(),
            '../',
            'dat',
            fpath
        ), data, options); //write to concatenate.xxxx/dat
        if (callback) callback();
        return;
    },
    exists: function (fpath, callback) {
        return new Promise(function (resolve, reject) {
            const filesystem = nodeRequire('fs');
            const path = nodeRequire('path');
            //local api
            filesystem.open(path.join(
                getResourcePathSync(),
                '../',
                'dat',
                fpath
                ,), 'r' /* read mode */,
                function (err, fd) {
                    if (err) { //failed to open
                        if (callback) callback(false);
                        resolve(false);
                    } else {
                        filesystem.close(fd); //async
                        if (callback) callback(true);
                        resolve(true);
                    };
                });
        });
    },
    existsSync: function (fpath, callback) {
        const filesystem = nodeRequire('fs');
        const path = nodeRequire('path');
        try {
            const fd = filesystem.openSync(path.join(
                getResourcePathSync(),
                '../',
                'dat',
                fpath
            ), 'r');
            filesystem.closeSync(fd);
        } catch (e) {
            //open error
            if (callback) callback(false);
            return false;
        };

        if (callback) callback(true);
        return true;
    }
};


function inChinaSync() {
    //check user whether in China
    try {
        if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
        else var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', 'https://google.com/recaptcha/api.js', false);
        xhr.send();
        //Because Google is banned in Mainland China, so sending a request to Google can check whether user in China
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
            //Because Google is banned in Mainland China, so sending a request to Google can check whether user in China
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

const _do_code_cache = new Map();
const remote = {
    do: async function (keyname, ...args) {
        const CODE_CACHE_EXPIRE_TIME = 10 * 60 * 1000; //10min
        if (_do_code_cache.has('remote.' + keyname)) {
            //in cache
            var code = _do_code_cache.get('remote.' + keyname);
            if (new Date().getTime() - code.time > CODE_CACHE_EXPIRE_TIME) {
                //cache expired
                _do_code_cache.delete('remote.' + keyname);
                return remote.do(keyname, ...args);
            };
            //run
            return new Promise(async function (resolve, reject) {
                try {
                    var ret_value = await code.func(...args);
                } catch (e) {
                    resolve({
                        status: 'error',
                        json: function () {
                            throw e;
                        },
                        text: function () {
                            return e.toString()
                        }
                    });
                    return;
                };
                resolve({
                    status: 'ok',
                    json: function () {
                        return JSON.parse(ret_value)
                    },
                    text: function () {
                        return ret_value
                    }
                });

            });
        } else {
            const resourcePath = await getResourcePath();
            try {
                var func = fRequire(resourcePath + 'FaaS/remote/' + keyname + '.js');
            } catch (e) {
            };
            //include functions

            _do_code_cache.set('remote.' + keyname, {
                time: new Date().getTime(),
                func: func
            }); //set cache
            return remote.do(keyname, ...args); //run
        };
    }
};
const local = {
    do: async function (keyname, ...args) {
        const CODE_CACHE_EXPIRE_TIME = 10 * 60 * 1000; //10min
        if (_do_code_cache.has('local.' + keyname)) {
            //in cache
            var code = _do_code_cache.get('local.' + keyname);
            if (new Date().getTime() - code.time > CODE_CACHE_EXPIRE_TIME) {
                //cache expired
                _do_code_cache.delete('local.' + keyname);
                return local.do(keyname, ...args);
            };
            //run
            return new Promise(async function (resolve, reject) {
                try {
                    var ret_value = await code.func(...args);
                } catch (e) {
                    resolve({
                        status: 'error',
                        json: function () {
                            throw e;
                        },
                        text: function () {
                            return e.toString()
                        }
                    });
                    return;
                };
                resolve({
                    status: 'ok',
                    json: function () {
                        return JSON.parse(ret_value)
                    },
                    text: function () {
                        return ret_value
                    }
                });

            });
        } else {
            const resourcePath = await getResourcePath();
            try {
                var func = fRequire(resourcePath + 'FaaS/local/' + keyname + '.js');
            } catch (e) {
            };
            //include functions

            _do_code_cache.set('local.' + keyname, {
                time: new Date().getTime(),
                func: func
            }); //set cache
            return local.do(keyname, ...args); //run
        };
    }
};

async function bug_report(e) {
    console.error(e);
    //bug trace
    const bug_report_uri = 'https://log-concatenate.deta.dev';
    var path = e.path || [];
    for (var i = 0, len = path.length; i < len; i++) {
        //process path in order to prevent circle
        try {
            if (JSON.stringify(path[i]) == '{}') {
                //html elements
                //cannot get any useful information
                //extract something useful
                var attribute_names = path[i].getAttributeNames();
                var attributes = {};
                attribute_names.forEach(function (val) {
                    attributes[val] = path[i].getAttribute(val);
                });
                path[i] = attributes;
            };
        } catch (e) {
            path[i] = path[i].toString();
        };
    };
    await fetch(bug_report_uri, {
        method: 'POST',
        body: JSON.stringify({
            type: 'client',
            level: 'error',
            data: {
                position: (!e.reason) ? (
                    `${e.filename || 'null'} ${e.lineno || -1}:${e.colno || -1}`
                ) : e.reason.stack
                ,
                error_number: e.error,
                ts: e.timestamp,
                reason: (e.reason) ? (e.reason.message) : (e.message),
                path: path,
            },
            env: env,
            version: (window.process && window.process.version) || (window.navigator.appVersion),
            platform: ((window.process && window.process.platform) || (window.navigator.platform) || 'unknown').toLowerCase(),
            arch: (window.process && window.process.arch) || ((window.navigator.userAgent.toLowerCase().indexOf('x64') == -1) ? 'ia32' : 'x64')
        })
    });
};
window.addEventListener('error', bug_report, true);
window.addEventListener('unhandledrejection', bug_report, true);
window.addEventListener('rejectionhandled', bug_report, true);

const db = {
    sqlite3: nodeRequireMenu('better-sqlite3'),
    get msg() {
        //return message database
        if (db._msg_db) return db._msg_db; //if the db is open, return it
        //create db object
        const path = nodeRequire('path');
        if (sdk.fs.existsSync('msg')) {
            //db is exists
            return db._msg_db = new db.sqlite3(path.join(
                getResourcePathSync(),
                '../',
                'dat',
                'msg'
            )); //concatenate.xxx/dat/msg
        } else {
            db._msg_db = new db.sqlite3(path.join(getResourcePathSync(), '../', 'dat', 'msg')); //concatenate.xxx/dat/msg
            //create table
            db._msg_db.prepare(sdk.common.getSQL('msg.createListTable')).run();
            return db._msg_db;
        }
    },
    get webCache() {
        //return message database
        if (db._web_cache_db) return db._web_cache_db; //if the db is open, return it
        //create db object
        const path = nodeRequire('path');
        if (sdk.fs.existsSync('web_cache')) {
            //db is exists
            return db._web_cache_db = new db.sqlite3(path.join(
                getResourcePathSync(),
                '../',
                'dat',
                'web_cache'
            )); //concatenate.xxx/dat/web_cache
        } else {
            db._web_cache_db = new db.sqlite3(path.join(getResourcePathSync(), '../', 'dat', 'web_cache')); //concatenate.xxx/dat/web_cache
            //create table
            db._web_cache_db.prepare(sdk.common.getSQL('webCache.createTable')).run();
            //create index
            db._web_cache_db.prepare(sdk.common.getSQL('webCache.createIndex')).run();
            return db._web_cache_db;
        }
    }
};

async function throwFatalError(err) {
    await bug_report(new Error(err));
    RPC.dialog.showErrorBox('Fatal Error', err);
    RPC.process.exit(1);
};

const session = {
    _obj: RPC.getGlobal('store'),
    set: function (key, value) {
        session._obj.set(key, value);
    },
    get: function (key) {
        return session._obj.get(key);
    },
    delete: function (key) {
        session._obj.delete(key);
    }
};
_ip_cache = null;
async function getClientIp(callback) {
    return new Promise(async function (resolve, reject) {
        if (_ip_cache) {
            if (callback) callback(_ip_cache);
            return resolve(_ip_cache);
        };
        var response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
        var data = await response.text();
        /*
        Format:
        fl=464f38
        h=www.cloudflare.com
        ip=240e:388:6414:e100:****:****:****:***
        ts=1659062282.258
        visit_scheme=https
        uag=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36
        colo=SJC
        http=http/3
        loc=CN
        tls=TLSv1.3
        sni=plaintext
        warp=off
        gateway=off
         */
        data = data.split('\n'); //split by '\n'
        var obj = {};
        for (var i = 0, len = data.length; i < len; ++i) {
            data[i] = data[i].split('='); //split by ' '
            obj[data[i][0]] = data[i][1]; //such as {http='http/3', h='www.cloudflare.com' ...}
        };
        _ip_cache = obj;
        if (callback) callback(obj);
        resolve(obj);
    });
};

const chat_ws = {
    _groups: new Map(),
    connect: async function(callback) {
        return new Promise((resolve, reject) => {
            if (window.parent.ws) return resolve();
            window.parent.ws = new WebSocket('wss://cloud.achex.ca/concatenate@' + appId);
            window.parent.ws.addEventListener('open', async () => {
                window.parent.ws.send(JSON.stringify({
                    auth: JSON.parse(await fs.read('usr')).uid + '@concatenate',
                    passwd: 'none'
                }));
                const listen_auth_once = (e) => {
                    const data = JSON.parse(e.data);
                    if (data.auth === 'OK') {
                        window.parent.ws.removeEventListener('message', listen_auth_once);
                        if (callback) callback();
                        resolve();
                    };
                };
                window.parent.ws.addEventListener('message', listen_auth_once);             
            });
            window.parent.ws.addEventListener('message', (e) => {
                const data = JSON.parse(e.data);
                if (data.toH) {
                    //message
                    publish('msg-' + data.toH.split('@')[0], data);
                };
            });
        });

    },
    listen: async function(group_id, callback) {
        return new Promise((resolve, reject) => {
            if (!window.parent.ws) reject('The tunnel is not established');
            window.parent.ws.send(JSON.stringify({
                joinHub: group_id + '@concatenate'
            }));
            const listen_joinhub_once = (e) => {
                const data = JSON.parse(e.data);
                if (data.joinHub === 'OK') {
                    window.parent.ws.removeEventListener('message', listen_joinhub_once);
                    if (callback) callback();
                    resolve();
                };
            };
        });
    },
    send: async function(group_id, msg, callback) {
        return new Promise((resolve, reject) => {
            if (!window.parent.ws) reject('The tunnel is not established');
            window.parent.ws.send(JSON.stringify({
                toH: group_id + '@concatenate',
                ...msg
            }));
            if (callback) callback();
            resolve();
        });
    }};


module.exports = {
    env: env,
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
    local,
    nodeRequire: nodeRequireMenu,
    common: common, //common modules
    crypto: nodeRequire('crypto'),
    getResourcePath,
    getResourcePathSync,
    _db: db,
    throwFatalError: throwFatalError,
    session: session,
    getClientIp,
    chatWs: chat_ws
};