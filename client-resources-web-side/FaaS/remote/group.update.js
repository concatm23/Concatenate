/* Concatenate browser pack tool: This file is not compressed and converted into es5 */

module.exports = async function main(data) {
    const env = {
        key: data.key || data.type,
        value: data.value || data.data,
        groupID: data.groupID,
        token: data.token
    };
    var res = await sdk.common.makeRequest((await sdk.getConfig('server')).group_server.change_group_info, env);
    return await sdk.common.convertResponse(res);
};