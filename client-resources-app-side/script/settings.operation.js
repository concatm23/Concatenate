/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 13:24:37
 * @LastEditTime    : 2022-08-19 15:31:02
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
    logout: async function () {
        const login_content = JSON.parse(await sdk.fs.read('usr')); //read user data
        login_content.login_time = 0; //set login time = 0, so that the software will recognize user login expires  
        await sdk.fs.write('usr', 'binary', JSON.stringify(login_content));
        //refresh the page
        parent.location.reload();
    },
    quitAPP: async function () {
        sdk.quit_app();
    },
    changeLanguage: async function (val) {
        if (!val) return;
        var config = await sdk.getConfig('');
        config.user_config.lang = val;
        sdk.setConfig(config);
        location.reload();
    },
    clearCache: async function () {
        const clearState = await sdk.clear_web_cache();
        if (!clearState) alert(translation.translate('@{settings.fail_to_clear_cache}'));
        else alert(translation.translate('@{settings.clear_cache_success}'));
    },
    uploadUserAvatar: async function (files, display, index, element) {
        //display.edit = false;
        //why vue does not work?
        element.style.display = 'none';


        const imageConversion = fRequire('../lib/image-conversion.js');
        const AVATAR_MIN_LIMIT = 320; //320k

        if (files[0].size > AVATAR_MIN_LIMIT * 1024) {
            //compress file
            var zippedFile = await imageConversion.compressAccurately(files[0], {
                height: 500,
                width: 500,
                size: AVATAR_MIN_LIMIT,
                type: 'image/png',
                accuracy: 0.98
            });
        } else var zippedFile = files[0];


        const fileReader = new FileReader();
        fileReader.readAsDataURL(zippedFile);
        fileReader.onload = async () => {
            //convert blob to base64
            const fileBase64 = fileReader.result.substring(fileReader.result.indexOf('base64,') + 7 /* the length of 'base64,' */);

            const response = await (await sdk.remote.do('fs.uploadAvatar', {
                token: sessionStorage.user_token,
                user_uid: sessionStorage.uid,
                content: fileBase64
            })).json();

            if (response.status === 'success') {
                setTimeout(() => {
                    sdk.local.do('webcache.delete', {
                        key: 'avatar-cache-user-' + sessionStorage.uid
                    });
                    //remove cache in 5min
                }, 5 * 60 * 1000);
                alert(translation.translate('@{settings.upload_avatar_success}'))

                location.reload();
                //reload the page
            } else alert(translation.translate('@{settings.failed_to_update_avatar}'))
        };
    }
};

