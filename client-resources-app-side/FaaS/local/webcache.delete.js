/**
 * @Author          : lihugang
 * @Date            : 2022-07-25 14:53:27
 * @LastEditTime    : 2022-07-25 22:29:36
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\webcache.delete.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function (data) {
    const cache_db = sdk._db.webCache;
    cache_db.prepare(sdk.common.getSQL('webCache.delete')).run({
        key: data.key,
        random_key: data.key + '.' + new Date().toISOString() + '-' + Math.random()
    });
};