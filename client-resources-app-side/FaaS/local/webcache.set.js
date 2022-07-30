/**
 * @Author          : lihugang
 * @Date            : 2022-07-25 14:53:27
 * @LastEditTime    : 2022-07-25 22:52:01
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\webcache.set.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function (data) {
    data.key = data.key || Math.random().toString(36).substring(2);
    data.value = data.value || '';
    data.expires_at = data.expires_at || new Date().getTime() + 3600 * 1000;
    const cache_db = sdk._db.webCache;
    try {
        cache_db.prepare(sdk.common.getSQL('webCache.set')).run({
            key: data.key,
            value: data.value,
            expires_at: data.expires_at
        });
    } catch (e) {
        cache_db.prepare(sdk.common.getSQL('webCache.update')).run({
            key: data.key,
            value: data.value,
        });
    };
};