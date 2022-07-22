/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 13:54:21
 * @LastEditTime    : 2022-07-22 15:43:38
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\require.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const fRequire = function _require(module) {
    if (window.XMLHttpRequest) var xhr = new XMLHttpRequest();
    else var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', module, false); //get source code sync
    xhr.send();
    if (!module || !module.exports) {
        window.module = {
            exports: null
        };
        window.exports = window.module.exports;
        //define module & exports
    };
    let evalFunc = new Function(xhr.responseText);
    evalFunc(); //run and parse
    let ret_module = window.module.exports;
    window.module.exports = null; //clear
    return ret_module;
};
const fRequireAsync = async function _requireAsync(module) {
    return new Promise((resolve, reject) => {
        var code = await(await(fetch(module))).text();
        if (!module || !module.exports) {
            window.module = {
                exports: null
            };
            window.exports = window.module.exports;
            //define module & exports
        };
        let evalFunc = new Function(xhr.responseText);
        evalFunc(); //run and parse
        let ret_module = window.module.exports;
        window.module.exports = null; //clear
        resolve(ret_module);

    });
};