

/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 12:27:30
 * @LastEditTime    : 2022-07-31 12:50:40
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\message.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const bind_func = {};
module.exports = {
    init: async function(group_list) {
        //create websocket tunnel and listen to groups
        await sdk.chatWs.connect();
        const listen_promises = [];
        group_list = new Map(group_list);

        group_list.forEach((val,key) => {
            listen_promises.push(sdk.chatWs.listen(key)); //execute async

            //listen to msg
            sdk.on('msg-' + key, function (e) {
                if (bind_func.notification) {
                    //notification function exists
                    bind_func.notification(
                        e.toH.split('@')[0], //group id
                        e.sender || 'null', //sender name
                        e.msg || 'null', //msg details
                    );
                };
            });
        });

        await Promise.all(listen_promises); //waiting for all resolved

        return; //ok
    },
    set: function (key, value) {
        bind_func[key] = value;
    } //bind function
};