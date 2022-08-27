/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 18:58:26
 * @LastEditTime    : 2022-07-31 19:42:19
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\msg.createTable.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function main(data) {
    var sql = sdk.common.getSQL('msg.createTable');
    sql = sdk.common.replaceString(sql, {
        group_id: data.group_id
    });
    try {
        sdk._db.msg.prepare(sql).run();
    } catch (e) {
        return e.message + '\n' + e.stack;
    };
    return 'ok';
};