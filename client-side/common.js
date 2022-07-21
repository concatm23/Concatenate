/**
 * @Author          : lihugang
 * @Date            : 2022-05-18 17:02:29
 * @LastEditTime    : 2022-05-31 11:02:55
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-base\common.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
async function makeRequest(obj, env) {
    obj = replaceObjects(obj, env);
    obj.request.headers = obj.request.headers || {};
    obj.request.headers["X-PLATFORM"] = process.platform;
    var response = await fetch(obj.request.url, {
        headers: obj.request.headers || { 'x-platform': process.platform },
        method: obj.request.method || 'GET',
        body: obj.request.body ? ((obj.request.body.encode == 'JSON') ? JSON.stringify(obj.request.body.data) : obj.request.body.data.toString()) : (void 0)
    });
    if (response.status == obj.response.success || obj.response.success == "all") {
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
    };
};

function fetch(reqPath, options = {}) {
    console.log(`Fetch`, reqPath, options);
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
            //var data = new Buffer();
            var data = "";
            res.on("data", chunk => {
                // for (var i = 0; i < chunk.length; i++) {
                //     data.push(chunk[i]);
                // };
                data += chunk;
            });
            res.on("end", () => {
                console.log({
                    status: res.statusCode,
                    headers: res.headers,
                    response: data
                });
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

};

function replaceObjects(obj, env) {
    for (var key in obj) {
        if (typeof obj[key] == "object") {
            obj[key] = replaceObjects(obj[key], env);
        } else if (typeof obj[key] == "string") {
            obj[key] = replaceString(obj[key], env);
        };
    };
    return obj;
};

function replaceString(s, globalEnvironment = {}) {
    if (typeof s != "string") return s;
    var match_arrays = s.match(/\${.*?}/gim);
    if (match_arrays == null) return s;
    for (var i = 0; i < match_arrays.length; i++) {
        s = s.replace(match_arrays[i], globalEnvironment[match_arrays[i].substring(2, match_arrays[i].length - 1)] || match_arrays[i]);
    };
    return s;
};

function convertResponse(data) {
    if (data[0] == 'success') return JSON.stringify({
        status: "success",
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

const _iRequire_record = [];

function iRequire(dest) {
    if (_iRequire_record[dest]) return _iRequire_record[dest];
    else _iRequire_record[dest] = require(dest);
    return iRequire(dest);
};
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
}

module.exports = {
    makeRequest,
    fetch,
    replaceString,
    replaceObjects,
    convertResponse,
    iRequire,
    getSQL,
    sqlInjectionTest
};