/**
 * @Author          : lihugang
 * @Date            : 2022-07-23 20:15:03
 * @LastEditTime    : 2022-07-24 16:16:38
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\groups.fetch.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = {
    local: async function() {
        var groupList = await sdk.local.do('group.getlist', {
            uid: JSON.parse(await sdk.fs.read('usr')).uid
        });
        groupList = await groupList.json();
        return groupList;
    },
    remote: async function() {
        var groupList = await sdk.remote.do('group.getlist', {
            token: JSON.parse(await sdk.fs.read('usr')).token
        });
        groupList = await groupList.json();
        if (groupList.status === 'failure') await sdk.throwFatalError(JSON.parse(groupList.data.source_return).code);
        else return JSON.parse(groupList.data);
    }
};