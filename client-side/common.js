/**
 * @Author          : lihugang
 * @Date            : 2022-05-18 17:02:29
 * @LastEditTime    : 2022-07-24 13:57:55
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\common.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
if (typeof require == 'undefined') runInNode = false;
else runInNode = true;
if (!runInNode) require = function () { };
if (typeof module == 'undefined') module = {
    exports: function () { }
};
const http = require('http');
const https = require('https');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
async function makeRequest(obj, env) {
    obj = deeply_copy(obj);
    obj = replaceObjects(obj, env);
    obj.request.headers = obj.request.headers || {};
    if (runInNode)
        obj.request.headers['X-PLATFORM'] = process.platform.toLowerCase();
    if (runInNode) do {
        var response = await fetch(obj.request.url, {
            headers: obj.request.headers || { 'x-platform': process.platform.toLowerCase() },
            method: obj.request.method || 'GET',
            body: obj.request.body ? ((obj.request.body.encode == 'JSON') ? JSON.stringify(obj.request.body.data) : obj.request.body.data.toString()) : (void 0)
        });
    } while (response.status >= 300 && response.status <= 310);
    else {
        var res = await fetch(obj.request.url, {
            headers: obj.request.headers || { 'x-platform': navigator.platform.toLowerCase() },
            method: obj.request.method || 'GET',
            body: obj.request.body ? ((obj.request.body.encode == 'JSON') ? JSON.stringify(obj.request.body.data) : obj.request.body.data.toString()) : (void 0)
        });
        var response = {
            status: res.status,
            headers: res.headers,
            response: await res.text()
        }
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
if (runInNode) var fetch = function (reqPath, options = {}) {
    try {
        var url = new URL(reqPath);
        return new Promise(function (resolve, reject) {
            const reqClass = (url.protocol == 'https:') ? https : http;
            const req = reqClass.request({
                host: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: options.method || 'GET',
                headers: options.headers || {}
            }, res => {
                var data = '';
                res.on('data', chunk => {
                    data += chunk.toString();
                });
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        response: data
                    });
                })
            });
            if (options.body) req.write(options.body);
            req.end();
        });
    } catch (e) {
        return {
            status: 0,
            headers: {},
            response: ''
        };
    };
};

if (runInNode) var download_file = async function (reqPath, options = {}, savePath = 'download') {
    try {
        var url = new URL(reqPath);
        return new Promise(function (resolve, reject) {
            const write_fd = fs.openSync(savePath, 'w');
            const reqClass = (url.protocol == 'https:') ? https : http;
            const req = reqClass.request({
                host: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: options.method || 'GET',
                headers: options.headers || {}
            }, res => {
                if (res.statusCode >= 300 && res.statusCode <= 399) {
                    //forward
                    resolve(download_file(res.headers.location, options, savePath));
                } else if (res.statusCode < 200 || res.statusCode >= 400) {
                    //bad http code
                    //download error
                    reject('Bad Http Status: ' + res.statusCode);
                    return;
                };
                res.on('data', chunk => {
                    fs.writeFileSync(write_fd, chunk, 'binary');
                });
                res.on('end', () => {
                    fs.closeSync(write_fd);
                    resolve();
                });
            });
            if (options.body) req.write(options.body, 'binary');
            req.end();
        });
    } catch (e) {
        return new Promise(function (resolve, reject) {
            reject('Bad URL: ' + reqPath);
        })
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


_sqlCache = new Map();
function getSQL(key/*,varibles = {}*/) {
    if (_sqlCache.has(key)) var sql = _sqlCache.get(key);
    else {
        try {
            // if (!window || !window.sdk) throw new Error('Cannot find sdk.');
            const sqlPath = path.join(sdk.getResourcePathSync(), 'sql', key + '.sql');
            var sql = fs.readFileSync(sqlPath);
            _sqlCache.set(key,sql);
        } catch (e) {
            return '';
        };
    };
    return /*sqlReplace(*/sql.toString()/*,varibles)*/;

};

function sqlReplace(s, varibles) {
    var match_arrays = s.match(/{.*?}/gim);
    if (match_arrays == null) return s;
    for (var i = 0; i < match_arrays.length; i++) {
        s = s.replace(match_arrays[i], varibles[match_arrays[i].substring(1, match_arrays[i].length - 1)] || match_arrays[i]);
    };
    return s;
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
    if (runInNode)
        format_string.append(chalk[logger.level_color[level]](`[${new Date().toISOString()}] [${logger.level_name[level]}] ${this.env} -`), chalk.white(''), ' ');
    else format_string.append('[', new Date().toISOString(), '] [', logger.level_name[level], '] ', this.env, ' - ', ' ');
    for (var i = 0, len = msg.length; i < len; ++i) {
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
    };
    console.log(format_string.toString());
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

module.exports = {
    makeRequest,
    fetch,
    replaceString,
    replaceObjects,
    convertResponse,
    getSQL,
    sqlInjectionTest,
    deeply_copy,
    StringBuilder,
    logger,
    download_file
};