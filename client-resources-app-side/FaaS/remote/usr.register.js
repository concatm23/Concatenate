
module.exports = async function register(data) {

    var logger = new sdk.common.logger('usr.register');
    var config = (await sdk.getConfig('server')).login_server.register;
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