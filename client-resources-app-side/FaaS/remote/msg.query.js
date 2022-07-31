/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 19:06:32
 * @LastEditTime    : 2022-07-31 19:07:08
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\remote\msg.query.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = async function main(data) {
    var token = data.token;
    const env = {
        token: token,
        groupID: data.group_id,
        cursor: data.cursor || null
    };
    var res = await sdk.common.makeRequest((await sdk.getConfig('server')).group_server.get_message, env);
    return (await sdk.common.convertResponse(res));
};