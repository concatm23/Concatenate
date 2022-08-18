
module.exports = async function main(data) {
    var { msg, anonymous, token, group_id, ip } = data;
    const env = {
        msg: msg,
        anonymous: anonymous || false,
        token: token,
        groupID: group_id,
        ip: ip || '0.0.0.0'
    };
    var res = await sdk.common.makeRequest((await sdk.getConfig('server')).group_server.send_message, env);
    return await sdk.common.convertResponse(res);
};