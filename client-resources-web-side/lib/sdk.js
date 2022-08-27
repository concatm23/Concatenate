//browser sdk
const env = 'browser';
const appId = 'pz6w7nkeote';

function getConfig(category, callback) {
    return new Promise(async function (resolve, reject) {
        var data = await localforage.getItem('user-config');
        if (!data) {
            //read error
            //set default value
            localforage.setItem('user-config', { "server": { "update_server": { "check": { "request": { "url": "https://download-concatenate.deta.dev/clientResource/latestReleaseVersion", "method": "GET" }, "response": { "success": 200, "failure": "other", "data": "all" } }, "download": { "request": { "url": "https://download-concatenate.deta.dev/clientResource/latest", "method": "GET" }, "response": { "success": 200, "failure": "other", "data": "all" } }, "timestamp": { "request": { "url": "https://download-concatenate.deta.dev/ping", "method": "GET" }, "response": { "success": 200, "failure": "other", "data": "all" } } }, "login_server": { "login": { "request": { "url": "https://login-concatenate.deta.dev/login", "method": "POST", "body": { "encode": "JSON", "data": { "username": "${username}", "passwordMD5": "${password_md5}", "recaptcha": "${captcha}", "ip": "${ip}" } } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "register": { "request": { "url": "https://login-concatenate.deta.dev/register", "method": "POST", "body": { "encode": "JSON", "data": { "username": "${username}", "password": "${password}", "passwordMD5": "${password_md5}", "recaptcha": "${captcha}", "ip": "${ip}" } } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "change_password": { "request": { "url": "https://login-concatenate.deta.dev/change_password", "method": "POST", "body": { "encode": "JSON", "data": { "username": "${username}", "password": "${password}", "passwordMD5": "${password_md5}", "oldPasswordMD5": "${old_password_md5}", "recaptcha": "${captcha}", "ip": "${ip}" } } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "get_info": { "request": { "url": "https://webapi-concatenate.deta.dev/usr/${uid}/info", "method": "GET", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 200, "failure": "other", "data": { "avatar": "avatar", "username": "username", "uid": "uid" } } } }, "group_server": { "list_group": { "request": { "url": "https://webapi-concatenate.deta.dev/usr/group/list", "method": "GET", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "join_group": { "request": { "url": "https://webapi-concatenate.deta.dev/group/join", "method": "POST", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" }, "body": { "encode": "JSON", "data": { "groupID": "${groupID}" } } }, "response": { "success": 200, "failure": "other", "data": { "status": "status" } } }, "quit_group": { "request": { "url": "https://webapi-concatenate.deta.dev/group/quit", "method": "POST", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" }, "body": { "encode": "JSON", "data": { "groupID": "${groupID}" } } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "new_group": { "request": { "url": "https://webapi-concatenate.deta.dev/group", "method": "POST", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 201, "failure": "other", "data": { "groupID": "groupID" } } }, "get_group_info": { "request": { "url": "https://webapi-concatenate.deta.dev/group/${groupID}/info", "method": "GET" }, "response": { "success": 200, "failure": "other", "data": { "name": "name", "members": "members", "permission": "permission", "avatar": "avatar" } } }, "change_group_info": { "request": { "url": "https://webapi-concatenate.deta.dev/group/${groupID}/info", "method": "PATCH", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" }, "body": { "encode": "JSON", "data": { "key": "${key}", "value": "${value}" } } }, "response": { "success": 201, "failure": "other", "data": "all" } }, "invite_member": { "request": { "url": "https://webapi-concatenate.deta.dev/group/${groupID}/members", "method": "POST", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" }, "body": { "encode": "JSON", "data": { "members": "${members}" } } }, "response": { "success": 201, "failure": "other", "data": "all" } }, "kick_member": { "request": { "url": "https://webapi-concatenate.deta.dev/group/${groupID}/members", "method": "DELETE", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" }, "body": { "encode": "JSON", "data": { "members": "${members}" } } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "send_message": { "request": { "url": "https://webapi-concatenate.deta.dev/group/${groupID}/msg", "method": "POST", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" }, "body": { "encode": "JSON", "data": { "msg": "${msg}", "anonymous": "${anonymous}", "ip": "${ip}" } } }, "response": { "success": 201, "failure": "other", "data": { "msg_id": "msg_id" } } }, "remove_message": { "request": { "url": "https://webapi-concatenate.deta.dev/group/${groupID}/msg/${msg_id}", "method": "DELETE", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "get_message": { "request": { "url": "https://webapi-concatenate.deta.dev/group/${groupID}/msg?cursor=${cursor}", "method": "GET", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 200, "failure": "other", "data": { "previousCursor": "previousCursor", "gather": "gather" } } }, "get_ip_info": { "request": { "url": "https://ip-concatenate.deta.dev/${ip}", "method": "GET", "headers": { "X-API-Accept": "concatenate.webapi/ip/1.0" } }, "response": { "success": 200, "failure": "other", "data": { "city": "city", "state": "state", "country": "country" } } } }, "socket_server": { "set_up_socket": { "require": "./wsproxy.js", "func": "setup" }, "send_msg_socket": { "require": "./wsproxy.js", "func": "send_msg" }, "on_msg_socket": { "require": "./wsproxy.js", "func": "on_msg" }, "listen_group": { "require": "./wsproxy.js", "func": "listen_group" }, "unbind_group": { "require": "./wsproxy.js", "func": "unbind_group" } }, "file_storage_server": { "do_upload": { "protocol": "https", "require": null, "func": "fss.do_upload", "request": { "url": "https://webapi-concatenate.deta.dev/storage", "method": "POST", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 201, "failure": "other", "data": { "fileID": "uid" } } }, "do_download": { "protocol": "https", "require": null, "func": "fss.do_download", "request": { "url": "https://webapi-concatenate.deta.dev/storage/${fileID}", "method": "GET", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "do_delete": { "protocol": "https", "require": null, "func": "fss.do_delete", "request": { "url": "https://webapi-concatenate.deta.dev/storage/${fileID}", "method": "DELETE", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 200, "failure": "other", "data": "all" } }, "get_info": { "protocol": "https", "require": null, "func": "fss.get_info", "request": { "url": "https://webapi-concatenate.deta.dev/storage/${fileID}?content=0", "method": "GET", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" } }, "response": { "success": 200, "failure": "other", "data": { "info": "data" } } }, "upload_avatar": { "protocol": "https", "require": null, "func": null, "request": { "url": "https://webapi-concatenate.deta.dev/usr/${user_uid}/avatar", "method": "PUT", "headers": { "Authorization": "${token}", "X-API-Accept": "concatenate.webapi/1.0" }, "body": { "encode": "JSON", "data": { "content": "${content}" } } }, "response": { "success": 201, "failure": "other", "data": { "avatar_uid": "avatar_uid" } } }, "get_avatar": { "protocol": "https", "require": null, "func": null, "request": { "url": "https://download-concatenate.deta.dev/user-avatar/${user_uid}", "method": "GET" }, "response": { "success": 200, "failure": "other", "data": "all" } } } }, "user_config": { "lang": "en_US" }, "experiments": null });
        };
        if (category === '.' || category === '');
        else data = data[category] || {};
        if (callback) callback(data);
        resolve(data);
    });
};
function setConfig(cfg) {
    localforage.setItem('user-config', cfg);
};
function getResourcePath(callback) {
    return new Promise(function (resolve, reject) {
        var data = '/vm/';
        if (callback) callback(data);
        resolve(data);
    });
};
function getResourcePathSync(callback) {
    var data = '/vm/';
    if (callback) callback(data);
    return data;
};
function getModulePath(name, callback) {
    return new Promise(function (resolve, reject) {
        var data = './';
        if (callback) callback(data);
        resolve(data);
    });
};

var _listeners = {};
const common = function () {
    async function makeRequest(obj, env) {
        obj = deeply_copy(obj);
        obj = replaceObjects(obj, env);
        obj.request.headers = obj.request.headers || {};
        var res = await fetch(obj.request.url, {
            headers: obj.request.headers || { 'x-platform': navigator.platform.toLowerCase() },
            method: obj.request.method || 'GET',
            body: obj.request.body ? ((obj.request.body.encode == 'JSON') ? JSON.stringify(obj.request.body.data) : obj.request.body.data.toString()) : (void 0)
        });
        var response = {
            status: res.status,
            headers: res.headers,
            response: await res.text()
        };


        //Send error msg(HTTP 502 ERROR: FaaS ERROR) To the server
        if (response.status == 502) {
            var currentLogger = new logger('common.js');
            //It's Hard code
            currentLogger.info('http 502 error');
            if (new URL(obj.request.url).hostname == 'webapi-concatenate.deta.dev') {
                //Official webapi
                currentLogger.info('api feedback');
                const options = {
                    method: 'POST',
                    body: JSON.stringify({
                        level: 'error',
                        type: 'server',
                        data: {
                            url: obj.request.url,
                            headers: obj.request.headers,
                            method: obj.request.method,
                            body: obj.request.body ? ((obj.request.body.encode == 'JSON') ? JSON.stringify(obj.request.body.data) : obj.request.body.data.toString()) : (void 0)
                        }
                    })
                };
                currentLogger.info(options);
                fetch('https://log-concatenate.deta.dev/', options);
            }
        }

        if (response.status == obj.response.success || obj.response.success == 'all') {
            var dataObj = {};
            if (obj.response.data == 'all') dataObj = response.response;
            else {
                if (typeof obj.response.data == 'string')
                    obj.response.data = JSON.parse(obj.response.data);
                var res = JSON.parse(response.response);
                for (var key in obj.response.data) {
                    dataObj[key] = res[obj.response.data[key]];
                };
            };
            return ['success', dataObj, response.status, response.headers];
        } else {
            return ['failure', response.response, response.status, response.headers];
        };
    };

    function replaceObjects(obj, env) {
        for (var key in obj) {
            if (typeof obj[key] == 'object') {
                obj[key] = replaceObjects(obj[key], env);
            } else if (typeof obj[key] == 'string') {
                obj[key] = replaceString(obj[key], env);
            };
        };
        return obj;
    };

    function replaceString(s, globalEnvironment = {}) {
        if (typeof s != 'string') return s;
        var match_arrays = s.match(/\${.*?}/gim);
        if (match_arrays == null) return s;
        for (var i = 0; i < match_arrays.length; i++) {
            s = s.replace(match_arrays[i], globalEnvironment[match_arrays[i].substring(2, match_arrays[i].length - 1)] || match_arrays[i]);
        };
        return s;
    };

    function convertResponse(data) {
        if (data[0] == 'success') return JSON.stringify({
            status: 'success',
            data: data[1]
        });
        else return JSON.stringify({
            status: data[0],
            data: {
                source_return: data[1]
            },
            code: data[2]
        })
    };

    function sqlInjectionTest(sql) {
        const matchRegExp = /create\s|drop\s|table\s|primary\s|key\s|insert\s|into\s|values\s|select\s|and\s|between\s|exists\s|in\s|like\s|glob\s|not\s|or\s|is\s|null\s|not\s|unique\s|where\s|update\s|limit\s|order\s|group\s|having\s|distinct\s|pragma\s|\s by|and'|or'|and\d|or\d|\sfrom|from\s|\swhere/gim;
        return !!sql.match(matchRegExp);
    };

    function deeply_copy(obj) {
        if (typeof obj !== 'object') return obj;
        var dest = {};
        for (var i in obj) {
            if (obj[i] instanceof Object) dest[i] = deeply_copy(obj[i]);
            else dest[i] = obj[i];
        };
        return dest;
    };

    function StringBuilder(str = '') {
        this.array = new Array(str.length);
        for (var i = 0, len = str.length; i < len; ++i) {
            this.array[i] = str[i];
        };
    };
    StringBuilder.prototype.append = function (...str) {
        for (var i = 0, len = str.length; i < len; ++i) {
            if (str[i] instanceof StringBuilder) {
                for (var j = 0, jlen = str[i].length; j < jlen; ++j) this.array.push(str[i].array[j]);
            } else if (typeof str[i] === 'string') {
                for (var j = 0, jlen = str[i].length; j < jlen; ++j) this.array.push(str[i][j]);
            } else this.array.push(str[i].toString());
        };
    };
    StringBuilder.prototype.toString = function () {
        return this.array.join('');
    };
    StringBuilder.prototype.clear = function () {
        this.array.length = 0;
    };

    function logger(env = 'default') { //env: the environment of logger
        this.env = env;
        this.level = logger.INFO;
    }; //logger system
    logger.ALL = 0;
    logger.TRACE = 1;
    logger.DEBUG = 2;
    logger.INFO = 3;
    logger.WARN = 4;
    logger.ERROR = 5;
    logger.FATAL = 6;
    logger.MARK = 7;
    logger.OFF = 8;
    logger.level_color = [
        0,
        'grey', //trace
        'cyan', //debug
        'green', //info
        'yellow', //warn
        'red', //error
        'magenta', //fatal
        'grey', //mark
        'grey', //off
    ];
    logger.level_name = [
        'ALL',
        'TRACE',
        'DEBUG',
        'INFO',
        'WARN',
        'ERROR',
        'FATAL',
        'MARK',
        'OFF',
    ];
    logger.prototype.filter = function (level = logger.INFO) {
        this.level = level;
    };// set logger level
    logger.prototype.print = function (level, msg) {
        if (level < this.level) return -1; //not print
        const format_string = new StringBuilder();
        return this.print_to_console(format_string, level, msg);
    };
    logger.prototype.print_to_console = function (format_string, level, msg) {
        format_string.append('%c [', new Date().toISOString(), '] [', logger.level_name[level], '] ', this.env, ' - ', '%c ');
        for (var i = 0, len = msg.length; i < len; ++i) {
            try {
                format_string.append(
                    (msg[i] instanceof Error) ? (
                        msg[i].message + '\n' + msg[i].stack
                    ) : (
                        (msg[i] instanceof Function) ? (
                            msg[i].name
                        ) : (
                            (typeof msg[i] === 'object') ? (
                                JSON.stringify(msg[i])
                            ) : (
                                (typeof msg[i] === 'undefined') ? (
                                    'undefined'
                                ) : (
                                    msg[i].toString()
                                )
                            )
                        )
                    )
                    , ' ');
            } catch (e) {
                format_string.append(e.toString());
            };

        };
        console.log(format_string.toString(), 'color: ' + logger.level_color[level], 'color: black');
        return 0;
    };
    logger.prototype.trace = function (...msg) { return this.print(logger.TRACE, msg) };
    logger.prototype.debug = function (...msg) { return this.print(logger.DEBUG, msg) };
    logger.prototype.info = function (...msg) { return this.print(logger.INFO, msg) };
    logger.prototype.warn = function (...msg) { return this.print(logger.WARN, msg) };
    logger.prototype.error = function (...msg) { return this.print(logger.ERROR, msg) };
    logger.prototype.fatal = function (...msg) { return this.print(logger.FATAL, msg) };
    logger.prototype.mark = function (...msg) { return this.print(logger.MARK, msg) };
    logger.prototype.off = function (...msg) { return this.print(logger.OFF, msg) };

    const store = {
        set: function (key, value) {
            localStorage[key] = value;
        },
        get: function (key) {
            return localStorage[key];
        },
        delete: function (key) {
            localStorage.removeItem(key);
        }
    };

    return {
        makeRequest,
        fetch,
        replaceString,
        replaceObjects,
        convertResponse,
        sqlInjectionTest,
        deeply_copy,
        StringBuilder,
        logger,
        store
    };
}();
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
            try {
                var data = await localforage.getItem('file-' + fpath);
            } catch (e) {
                return reject('File is not exists or it is not readable.');
            };
            if (data === null) return reject('File is not exists or it is not readable.');
            if (callback) callback(data);
            resolve(data);
        });
    },
    write: async function (fpath, options, data, callback) {
        return new Promise(async (resolve, reject) => {
            try {
                await localforage.setItem('file-' + fpath, data);
            } catch (e) {
                return reject('File is not writable.');
            };
            if (callback) callback();
            resolve();
        });
    },
    exists: function (fpath, callback) {
        return new Promise(async function (resolve, reject) {
            try {
                await fs.read(fpath);
            } catch (e) {
                if (callback) callback(false);
                resolve(false);
                return;
            };
            if (callback) callback(true);
            resolve(true);
            return;
        });
    },
    unlink: function (fpath, callback) {
        return new Promise(async function (resolve, reject) {
            try {
                await localforage.removeItem(fpath);
            } catch (e) {
                if (callback) callback(false);
                resolve(false);
                return;
            };
            if (callback) callback(true);
            resolve(true);
            return;
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

async function throwFatalError(err) {
    await bug_report(new Error(err));
    alert('Fatal Error\n' + err);
    location.href = '/vm/err.html?err=' + err;
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
                        if (Math.random() < 0.4) wsTunnel.send(JSON.stringify(
                            {
                                _to_group: -1,
                                toH: 'concatenate.message'
                            }
                        ))
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
    location.href = '/vm/entry.html'
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
    common: common, //common modules
    crypto: {
        createHash: (type) => {
            const md5 = fRequire('https://unpkg.com/js-md5');
            if (type === 'md5') return {
                update: (content) => {
                    return {
                        digest: (resultType) => {
                            if (resultType === 'hex') return md5(content);
                        }
                    }
                }
            }
        }
    },
    getResourcePath,
    getResourcePathSync,
    throwFatalError: throwFatalError,
    getClientIp,
    chatWs: chat_ws,
    quit_app, clear_web_cache
};