/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 13:24:37
 * @LastEditTime    : 2022-08-15 09:17:40
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\settings.operation.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = {
    logout: async function() {
        const login_content = JSON.parse(await sdk.fs.read('usr')); //read user data
        login_content.login_time = 0; //set login time = 0, so that the software will recognize user login expires  
        await sdk.fs.write('usr','binary', JSON.stringify(login_content));
        //refresh the page
        parent.location.reload();
    },
    quitAPP: async function() {
        sdk.quit_app();
    },
    changeLanguage: async function(val) {
        if (!val) return;
        var config = await sdk.getConfig('');
        config.user_config.lang = val;
        sdk.setConfig(config);
        location.reload();
    }
};