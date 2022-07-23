
module.exports = async function login(data) {

    var logger = new sdk.common.logger('usr.login');
    console.info(data);
    var config = (await sdk.getConfig('server')).login_server.login;
    var username = data.username;
    var password = data.password;
    var captcha = data.captcha;
    var password_md5 = sdk.crypto.createHash('md5').update(password).digest('hex');
    const env = {
        username: username,
        password: password,
        password_md5: password_md5,
        captcha: captcha,
        ip: data.ip
    };
    logger.info(env);
    var response = await sdk.common.makeRequest(config, env);
    return await sdk.common.convertResponse(response);
};