/* Concatenate browser pack tool: This file is not compressed and converted into es5 */

module.exports = async function main(data) {
    const env = {
        groupID: data.groupID,
        token: data.token,
        members: data.inviteUser
    };
    var res = await sdk.common.makeRequest((await sdk.getConfig('server')).group_server.invite_member, env);
    return await sdk.common.convertResponse(res);
};