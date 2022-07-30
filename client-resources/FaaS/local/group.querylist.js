/**
 * @Author          : lihugang
 * @Date            : 2022-07-25 13:51:42
 * @LastEditTime    : 2022-07-25 14:12:43
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\group.querylist.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = async function main(data) {
    var msgDB = sdk._db.msg;
    return JSON.stringify(
        msgDB.prepare(sdk.common.getSQL('msg.querygroup')).all({
            uid: data.uid,
            group_id: data.group_id
        })
    );
};