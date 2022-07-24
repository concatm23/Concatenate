/**
 * @Author          : lihugang
 * @Date            : 2022-07-23 20:14:51
 * @LastEditTime    : 2022-07-23 22:33:05
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\groups.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function () {
    sdk.on('translation-finish-loading', async function () {
        const renders = fRequire('../script/groups.render.js');
        renders.renderTitle();

        renders.renderSwitchButton();

        const groupList = await sdk.local.do('group.getlist', {
            uid: JSON.parse(await sdk.fs.read('usr')).uid
        });
    });

};