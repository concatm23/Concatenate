/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 18:17:41
 * @LastEditTime    : 2022-07-31 20:08:11
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\group.addMsgCount.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = async function main(data = {}) {
    var msgDB = sdk._db.msg;
    var result = await sdk.local.do('group.querylist', {
        uid: data.uid,
        group_id: data.group_id
    });
    result = await result.json();
    var currentCounter = result[0].msg_counts;
    currentCounter += data.counts;

    return JSON.stringify(msgDB.prepare(sdk.common.getSQL('msg.updateMsgCount')).run({
        group_id: data.group_id,
        user_uid: data.uid,
        msg_counts: currentCounter
    }));
};