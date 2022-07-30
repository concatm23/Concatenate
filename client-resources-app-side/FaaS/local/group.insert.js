/**
 * @Author          : lihugang
 * @Date            : 2022-06-05 11:05:50
 * @LastEditTime    : 2022-07-24 16:43:26
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\group.insert.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function main(data = {}) {
    var msgDB = sdk._db.msg;
    return JSON.stringify(msgDB.prepare(sdk.common.getSQL('msg.insertList')).run({
        group_id: data.group_id,
        alias: data.alias || '',
        join_time: data.join_time || 0,
        last_read: data.last_read || 0,
        last_msg: data.last_msg || 0,
        is_on_top: data.is_on_top || 0,
        is_show: (data.is_show == undefined) ? 1 : data.is_show,
        user_uid: data.user_uid,
        group_type: data.group_type || 0,
    }));
};