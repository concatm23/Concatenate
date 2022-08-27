/* Concatenate browser pack tool: This file is not compressed and converted into es5 */

module.exports = async function login(data) {

    var config = (await sdk.getConfig('server')).login_server.get_info;
    const env = {
        uid: data.uid
    };
    var response = await sdk.common.makeRequest(config, env);
    return await sdk.common.convertResponse(response);
};