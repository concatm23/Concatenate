const http = require('http');
const https = require('https');
const fs = require('fs');
const chalk = require('chalk');

async function makeRequest(obj, env) { //make request with config.yaml
    obj = replaceObjects(obj, env); //replace variables
    obj.request.headers = obj.request.headers || {};
    obj.request.headers['X-PLATFORM'] = process.platform; //Platform set
    var response = await fetch(obj.request.url, { //browser like fetch
        headers: obj.request.headers || { 'x-platform': process.platform },
        method: obj.request.method || 'GET',
        body: obj.request.body ? ((obj.request.body.encode == 'JSON') ? JSON.stringify(obj.request.body.data) : obj.request.body.data.toString()) : (void 0)
    });
    if (response.status == obj.response.success || obj.response.success == 'all') {
        var dataObj = {};
        if (obj.response.data == 'all') dataObj = response.response;
        else {
            obj.response.data = JSON.parse(obj.response.data);
            var res = JSON.parse(response.response);
            for (var key in obj.response.data) {
                dataObj[key] = res[obj.response.data[key]];
            };
        };
        return ['success', dataObj, response.status, response.headers];
    } else {
        return ['failure', response.response, response.status, response.headers];
    }; //get objects
};

function fetch(reqPath, options = {}) {
    var url = new URL(reqPath); //parse url
    return new Promise(function (resolve, reject) {
        const reqClass = (url.protocol == 'https:') ? https : http; //choose protocol
        const req = reqClass.request({
            host: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        }, res => {
            var data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    response: data
                });
            });
        });
        if (options.body) req.write(options.body, 'binary');
        req.end();
    });

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

//get sql from disk
_sqlCache = new Map();
function getSQL(key/*,varibles = {}*/) {
    if (_sqlCache.has(key)) var sql = _sqlCache.get(key);
    else {
        try {
            var sql = fs.readFileSync(process.env.APPDATA + '/concatenate.storage/resources/sql/' + key + '.sql');
        } catch (e) {
            return '';
        };
    };
    return /*sqlReplace(*/sql.toString()/*,varibles)*/;

};

function sqlInjectionTest(sql) {
    const matchRegExp = /create\s|drop\s|table\s|primary\s|key\s|insert\s|into\s|values\s|select\s|and\s|between\s|exists\s|in\s|like\s|glob\s|not\s|or\s|is\s|null\s|not\s|unique\s|where\s|update\s|limit\s|order\s|group\s|having\s|distinct\s|pragma\s|\s by|and'|or'|and\d|or\d|\sfrom|from\s|\swhere/gim;
    return !!sql.match(matchRegExp);
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
logger.OFF = 7;
logger.level_color = [
    0,
    'gray', //trace
    'green', //debug
    'white', //info
    'yellow', //warn
    'orange', //error
    'red', //fatal 
];
logger.level_name = [
    'ALL',
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'FATAL',
    'OFF',
];
logger.prototype.filter = function (level = logger.INFO) {
    this.level = level;
};// set logger level
logger.prototype.print = function (level, msg) {
    if (level < this.level) return -1; //not print
    const format_string = new StringBuilder();
    format_string.append(new Date().toISOString(), ' ', this.env, ' ');
    return this.print_to_console(format_string, level, msg); //build basic output message
};
logger.prototype.print_to_console = function (format_string, level, msg) {
    format_string.append(chalk[logger.level_color[level]](logger.level_name[level]), ' ');
    for (var i = 0, len = msg.length; i < len; ++i) {
        format_string.append(
            (msg[i] instanceof Error) ? (
                new StringBuilder().append(msg[i].message, '\n', msg[i].stack).toString()
            ) : (
                (typeof msg[i] === 'object') ? (
                    JSON.stringify(msg[i])
                ) : msg[i].toString()
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

module.exports = {
    makeRequest,
    fetch,
    replaceString,
    replaceObjects,
    convertResponse,
    iRequire,
    getSQL,
    sqlInjectionTest,
    StringBuilder,
    logger
};