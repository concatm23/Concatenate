/* Concatenate browser pack tool: This file is not compressed and converted into es5 */
/**
 * @Author          : lihugang
 * @Date            : 2022-08-19 15:39:00
 * @LastEditTime    : 2022-08-19 15:40:03
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\remote\group.create.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = async function main(data) {
    const env = {
        token: data.token
    };
    var res = await sdk.common.makeRequest((await sdk.getConfig('server')).group_server.new_group, env);
    return (await sdk.common.convertResponse(res));
};