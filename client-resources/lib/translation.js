/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 15:54:03
 * @LastEditTime    : 2022-07-22 17:51:49
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\lib\translation.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const config = async function (map, basePath) {
    const lang = map.lang; //language
    fetch(`${basePath}locales/${lang}`).then(async function (map) {
        window.translation_map = JSON.parse(await map.text());
        sdk.publish('translation-finish-loading');
    });
};
const translate = function (s) {
    if (typeof s != 'string') return s;
    var match_arrays = s.match(/\@{.*?}/gim);
    if (match_arrays == null) return s; //no matches
    for (var i = 0; i < match_arrays.length; i++) {
        s = s.replace(match_arrays[i], window.translation_map[match_arrays[i].substring(2, match_arrays[i].length - 1)] || match_arrays[i]);
    };
    return s;
};
const translatePage = function () {
    var content = document.body.innerHTML;
    document.body.innerHTML = translate(content);
};
module.exports = {
    config,
    translate,
    translatePage
}