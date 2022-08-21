

/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 12:27:30
 * @LastEditTime    : 2022-08-20 21:02:33
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
const logger = new sdk.common.logger('Message Handler');
module.exports = {
    init: async function(group_list) {
        //create websocket tunnel and listen to groups
        await sdk.chatWs.connect();
        const listen_promises = [];

        //console.log(group_list);

        for (var i = 0, len = group_list.length; i < len; i++) {
            var val = group_list[i];
            listen_promises.push(sdk.chatWs.listen(val)); //execute async

            //listen to msg
            sdk.on('msg-' + val, async function (e) {
                logger.info('Get message', e);
                if (bind_func.notification) {
                    //notification function exists
                    bind_func.notification(
                        e.toH.split('@')[0], //group id
                        e.sender || 'null', //sender name
                        e.msg || 'null', //msg details
                    );
                };
                //insert to local database
                
                const insertResponse = await (await sdk.local.do('msg.insert', {
                    cType: e.cType,
                    content: e.msg,
                    username: e.sender,
                    uid: e.sender_uid,
                    status: (1 << 2) /*MSG_RECEIVED*/ & (1 << 3),/*MSG_OTHER_SENDED */
                    cursor: e.cursor,
                    ts: parseInt(e.cursor) || new Date().getTime(),
                    ip: e.ip,
                    is_received: 1,
                    group_id: e.toH.split('@')[0]
                })).text();
                
                logger.info('insert status', insertResponse);
            });
        };

        await Promise.all(listen_promises); //waiting for all resolved

        return; //ok
    },
    set: function (key, value) {
        bind_func[key] = value;
    } //bind function
};