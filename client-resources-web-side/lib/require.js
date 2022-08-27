
const _requireCache = new Map();
const fRequire = function _require(module) {
    if (_requireCache.has(module)) return _requireCache.get(module);
    if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
    else var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', module, false); //get source code sync
    xhr.onerror = function () { throw new Error('Cannot find module ' + module); };
    try {
        xhr.send();
    } catch (e) { throw new Error('Cannot find module ' + module); };
    if (xhr.status < 200 || xhr.status >= 400) {
        //request error
        throw new Error('Cannot find module ' + module);
    };
    if (!module || !module.exports) {
        window.module = {
            exports: {}
        };
        window.exports = window.module.exports;
        //define module & exports

        window.global = window;
        //virtual node env
    };
    let evalFunc = new Function(xhr.responseText);
    evalFunc(); //run and parse
    let ret_module = window.module.exports;
    window.module.exports = null; //clear
    _requireCache.set(module, ret_module);
    return ret_module;
};
const fRequireAsync = async function _requireAsync(module) {
    return new Promise(async (resolve, reject) => {
        if (_requireCache.has(module)) return resolve(_requireCache.get(module));
        const response = await fetch(module);
        if (!response.ok) throw new Error('Cannot find module ' + module);
        var code = await (response).text();
        if (!module || !module.exports) {
            window.module = {
                exports: null
            };
            window.exports = window.module.exports;
            //define module & exports
            window.global = window;
        };
        let evalFunc = new Function(code);
        evalFunc(); //run and parse
        let ret_module = window.module.exports;
        window.module.exports = null; //clear
        _requireCache.set(module, ret_module);
        resolve(ret_module);

    });
};