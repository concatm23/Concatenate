/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 18:49:40
 * @LastEditTime    : 2022-07-31 20:09:42
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\groups.syncMessage.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = async function(group_id) {
    const logger = new sdk.common.logger('Sync Msg');
    sessionStorage.setItem('sync-msg-' + group_id, 'pending');
    logger.info('Sync pending',group_id);
    var latest_msg_time = 0;
    var msgs = await sdk.local.do('msg.query', {
        uid: sessionStorage.uid,
        group_id: group_id,
        timestamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 8 //query messages from the latest 8 days, because of the message in the server will be expired in 7 days
    });
    if (msgs.status === 'error') {
        //table not exists
        await sdk.local.do('msg.createTable', {
            group_id: group_id
        });
    } else {
        msgs = await msgs.json();
        for (var i = msgs.length - 1; i >= 0; --i) {
            if (!isNaN(parseInt(msgs[i].cursor))) {
                //not a NaN
                //the message that sending successfully
                latest_msg_time = parseInt(msgs[i].cursor);
                break;
            };
        };
    };
    logger.info('latest msg time',group_id,latest_msg_time);
    var cursor = null;
    const { token } = JSON.parse(await sdk.fs.read('usr'));
    var message_lists = [];
    let counts = 0;
    while (1) {
        logger.info('Sync fetch', group_id, cursor);
        var result = await sdk.remote.do('msg.query', {
            token: token,
            cursor: cursor,
            group_id: group_id
        });
        result = await result.json();
        result = result.data;
        cursor = result.previousCursor; //update cursor
        var i,len;
        for (i = 0, len = result.gather.length; i < len && parseInt(result.gather[i].cursor) > latest_msg_time; ++i) {
            message_lists.push(result.gather[i]); //collect messages
            counts++;
        };
        if (i != len) {
            //not reach end
            //collect all message from the latest read
            break;
        };
        if (!cursor) break;
        break;
    };
    message_lists = message_lists.reverse(); //the latest message is in the end, the oldest message is in the beginning
    for (var i = 0, len = message_lists.length; i < len; ++i) {
        message_lists[i].cType = 0;
        message_lists[i].content = message_lists[i].msg;
        message_lists[i].ts = parseInt(message_lists[i].cursor);
        message_lists[i].status = 3; //MSG_RECEIVED
        message_lists[i].group_id = group_id;
        message_lists[i].is_received = 1;
    };
    logger.info('Sync inserting', group_id, message_lists);
    const insert_result = await sdk.local.do('msg.insertMany', message_lists);
    if (insert_result.status === 'error') throw insert_result.json();
    sessionStorage.setItem('sync-msg-' + group_id, 'finished');
    logger.info('Sync finished', group_id);

    await sdk.local.do('group.addMsgCount', {
        group_id: group_id,
        uid: sessionStorage.uid,
        counts: counts
    });

    //update list on the page
    const element = document.querySelector('#group' + group_id);
    if (element) {
        const index = ~~element.getAttribute('data_index');
        const object = window.render_list[index];
        object.new_message_counts += counts;
    };
};