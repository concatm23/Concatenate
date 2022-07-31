/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 19:29:59
 * @LastEditTime    : 2022-07-31 19:46:19
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\FaaS\local\msg.insertMany.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = async function (data) {
    var promise_list = [];
    for (var i = 0, len = data.length; i < len; ++i) {
        promise_list.push(sdk.local.do('msg.insert', data[i]));
    };
    const list = await Promise.all(promise_list);
    list.forEach((item) => {
        if (item.status === 'error') throw item.json();
    });
};