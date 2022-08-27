/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 13:54:07
 * @LastEditTime    : 2022-08-20 22:11:06
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
    if (!window.nodeRequire) window.nodeRequire = window.parent.nodeRequire;
    //auto set require path
    if (path == 'common') return window.nodeRequire(`${localStorage.getItem('node_modules_position')}../common.js`); //common functions with frontend and backend
    return window.nodeRequire(`${localStorage.getItem('node_modules_position')}${path}`);
};


const RPC = nodeRequireMenu('@electron/remote'); //remote
function getConfig(category, callback) {
    return new Promise(function (resolve, reject) {
        try {
            var data = RPC.getGlobal('config_ptr').config;
            if (category === '.' || category === '');
            else data = data[category] || {};
            if (callback) callback(data);
            resolve(data);
        } catch (e) {
            fs.unlink('config.yaml');
            throwFatalError('Because of some exceptions, the configuration broke down. \nReopen the application to recover to default.');
        };

    });
};
function setConfig(config) {
    RPC.getGlobal('config_ptr').config = config;
    const js_yaml = nodeRequireMenu('js-yaml');
    const content = js_yaml.dump(config);
    sdk.fs.write('config.yaml', 'utf-8', content);
    sdk.fs.write('config.yaml', 'utf-8', content);
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
    for (var i = 0, len = _listeners[e].length; i < len; ++i) if (_listeners[e][i] instanceof Function) _listeners[e][i](...data); else event_logger.warn('Bad listener', _listeners[e][i]);
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
    },
    unlink: function (fpath, callback) {
        return new Promise(function (resolve, reject) {
            const filesystem = nodeRequire('fs');
            const path = nodeRequire('path');
            //local api
            filesystem.unlink(path.join(
                getResourcePathSync(),
                '../',
                'dat',
                fpath,
            ),
                function (err) {
                    if (err) { //failed to open
                        console.error(err);
                        if (callback) callback(false);
                        resolve(false);

                        //setTimeout(fs.unlink(fpath),2000); //try per 2000ms
                    } else {
                        if (callback) callback(true);
                        resolve(true);
                    };
                });
        });
    },
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
    do: async function (key_name, ...args) {
        const CODE_CACHE_EXPIRE_TIME = 10 * 60 * 1000; //10min
        if (_do_code_cache.has('remote.' + key_name)) {
            //in cache
            var code = _do_code_cache.get('remote.' + key_name);
            if (new Date().getTime() - code.time > CODE_CACHE_EXPIRE_TIME) {
                //cache expired
                _do_code_cache.delete('remote.' + key_name);
                return remote.do(key_name, ...args);
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
                var func = fRequire(resourcePath + 'FaaS/remote/' + key_name + '.js');
            } catch (e) {
            };
            //include functions

            _do_code_cache.set('remote.' + key_name, {
                time: new Date().getTime(),
                func: func
            }); //set cache
            return remote.do(key_name, ...args); //run
        };
    }
};
const local = {
    do: async function (key_name, ...args) {
        const CODE_CACHE_EXPIRE_TIME = 10 * 60 * 1000; //10min
        if (_do_code_cache.has('local.' + key_name)) {
            //in cache
            var code = _do_code_cache.get('local.' + key_name);
            if (new Date().getTime() - code.time > CODE_CACHE_EXPIRE_TIME) {
                //cache expired
                _do_code_cache.delete('local.' + key_name);
                return local.do(key_name, ...args);
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
                var func = fRequire(resourcePath + 'FaaS/local/' + key_name + '.js');
            } catch (e) {
            };
            //include functions

            _do_code_cache.set('local.' + key_name, {
                time: new Date().getTime(),
                func: func
            }); //set cache
            return local.do(key_name, ...args); //run
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
    _groups: new Set(),
    connect: async function (callback) {
        return new Promise((resolve, reject) => {
            let wsTunnel = window.ws || window.parent.ws || window.parent.parent.ws;
            window.parent.parent.wsGroupRecord = window.parent.parent.wsGroupRecord || new Set();
            let wsGroupRecord = window.wsGroupRecord || window.parent.wsGroupRecord || window.parent.parent.wsGroupRecord;
            if (wsTunnel && wsTunnel.readyState === 1) {
                wsTunnel.addEventListener('message', (e) => {
                    try {
                        var data = JSON.parse(e.data);
                    } catch (e) { return; };
                    if (data.toH) {
                        //message
                        data._to_group = ~~data._to_group;
                        if (wsGroupRecord.has(data._to_group))
                            sdk.publish('msg-' + data._to_group, {
                                ...data,
                                toH: data._to_group + '@',
                            });
                    };
                });
                console.log('Add message listener', location.href);
                return resolve();
            } else console.warn(wsTunnel, wsTunnel && wsTunnel.readyState);
            window.parent.ws = new WebSocket('wss://cloud.achex.ca/concatenate@' + appId);
            wsTunnel = window.ws || window.parent.ws || window.parent.parent.ws;
            wsTunnel.addEventListener('open', async () => {
                setInterval(() => {
                    try {
                        wsTunnel.send(JSON.stringify({ ping: true }));
                    } catch (e) {
                        throwFatalError(translation.translate('@{chat.ws_tunnel_destroyed}'));
                    };

                }, 15 * 1000); //pong server per 15s
                wsTunnel.send(JSON.stringify({
                    auth: JSON.parse(await fs.read('usr')).uid + '@concatenate',
                    passwd: 'none'
                }));
                const listen_auth_once = (e) => {
                    const data = JSON.parse(e.data);
                    if (data.auth === 'OK') {
                        wsTunnel.removeEventListener('message', listen_auth_once);
                        if (callback) callback();
                        resolve();
                    };
                };
                wsTunnel.addEventListener('message', listen_auth_once);
            });
            if (!wsGroupRecord.has(location.href)) {
                wsGroupRecord.add(location.href);
                wsTunnel.addEventListener('message', (e) => {
                    try {
                        var data = JSON.parse(e.data);
                    } catch (e) { return; };
                    if (data.toH) {
                        //message
                        data._to_group = ~~data._to_group;
                        console.log('Receive msg', data, wsGroupRecord.has(data._to_group));
                        console.log('Current page', location.href);
                        if (wsGroupRecord.has(data._to_group))
                            sdk.publish('msg-' + data._to_group, {
                                ...data,
                                toH: data._to_group + '@',
                            });
                    };
                });
                console.log('Add message listener', location.href);
            } else console.warn('Too much message listener', location.href);

            wsTunnel.addEventListener('error', (e) => {
                console.error(e);
                throwFatalError('Failed to establish socket tunnel.');
            });
            wsTunnel.addEventListener('close', (e) => {
                console.error(e);
                throwFatalError(translation.translate('@{chat.ws_tunnel_destroyed}'));
            });
            wsTunnel.addEventListener('closed', (e) => {
                console.error(e);
                throwFatalError(translation.translate('@{chat.ws_tunnel_destroyed}'));
            });

        });

    },
    listen: async function (group_id, callback) {
        return new Promise((resolve, reject) => {
            const wsGroupRecord = window.wsGroupRecord || window.parent.wsGroupRecord || window.parent.parent.wsGroupRecord;
            wsGroupRecord.add(group_id);
            if (wsGroupRecord.has('listen_once')) {
                if (callback) callback();
                resolve();
                return;
            } else wsGroupRecord.add('listen_once');
            const wsTunnel = window.ws || window.parent.ws || window.parent.parent.ws;
            if (!wsTunnel) reject('The tunnel is not established');
            // wsTunnel.send(JSON.stringify({
            //     joinHub: group_id + '@concatenate'
            // }));
            // const listen_join_hub_once = async (e) => {
            //     const data = JSON.parse(e.data);
            //     if (data.joinHub === 'OK') {
            //         wsTunnel.removeEventListener('message', listen_join_hub_once);
            //         if (callback) callback();
            //         resolve();
            //     } else if (data.joinHub === 'FAILED') {
            //         console.error(data);
            //         resolve(await chat_ws.listen(group_id, callback));
            //         //sdk.throwFatalError('Failed to establish socket tunnel.');
            //     };

            //     ///wsTunnel.removeEventListener('message', listen_join_hub_once);
            // };
            // wsTunnel.addEventListener('message', listen_join_hub_once);

            wsTunnel.send(JSON.stringify({
                joinHub: 'concatenate.message'
            }));
            wsTunnel.addEventListener('message', async (e) => {
                const data = JSON.parse(e.data);
                if (data.joinHub === 'OK') {
                    if (callback) callback();
                    resolve();
                };
                if (data.joinHub === 'FAILED') {
                    console.error(data);
                    resolve(await chat_ws.listen(group_id, callback));
                };
            });

        });
    },
    send: async function (group_id, msg, callback) {
        return new Promise((resolve, reject) => {
            try {
                const wsTunnel = window.ws || window.parent.ws || window.parent.parent.ws;
                if (!wsTunnel) reject('The tunnel is not established');
                // wsTunnel.send(JSON.stringify({
                //     joinHub: group_id + '@concatenate',
                // }));
                // wsTunnel.send(JSON.stringify({
                //     toH: group_id + '@concatenate',
                //     ...msg
                // }));
                wsTunnel.send(JSON.stringify({
                    toH: 'concatenate.message',
                    _to_group: group_id,
                    ...msg
                }));
            } catch (e) {
                console.error(e);
                throwFatalError('Failed to send message to socket\n' + e.message);
            };
            if (callback) callback();
            resolve();

        });
    }
};

function quit_app() {
    RPC.process.exit(0);
};

function clear_web_cache() {
    return fs.unlink('web_cache');
};


module.exports = {
    env: env,
    platform: navigator.platform.toLowerCase(),
    fs: fs,
    getConfig: getConfig,
    setConfig: setConfig,
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
    chatWs: chat_ws,
    quit_app, clear_web_cache
};