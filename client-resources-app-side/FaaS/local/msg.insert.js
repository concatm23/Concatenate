

/**
 * @Author          : lihugang
 * @Date            : 2022-06-25 18:10:56
 * @LastEditTime    : 2022-08-17 10:00:19
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\msg.insert.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function main(data) {
    var sql = sdk.common.getSQL('msg.insertMsgList');
    sql = sdk.common.replaceString(sql, {
        group_id: data.group_id
    });
    sdk._db.msg.prepare(sql).run({
        cType: data.cType || 0,
        content: data.content,
        username: data.username,
        uid: data.uid,
        status: data.status,
        cursor: data.cursor,
        timestamp: data.ts || new Date().getTime(),
        ip: data.ip,
        is_received: data.is_received || 0
    });

}