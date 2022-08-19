

const groupId = location.search.substring(1);

const wsPackage = fRequire('../script/message.js');

sdk.once('ui-back-page', () => {
    parent.document.querySelector('.group-frame').style.display = 'none';
});

const messagePackage = fRequire('../lib/msg.js');

const MSG_MIN_LIMIT = 5, MSG_MAX_LIMIT = 1000;

(async () => {
    sessionStorage.username = JSON.parse(await sdk.fs.read('usr')).username;
    sessionStorage.user_token = JSON.parse(await sdk.fs.read('usr')).token;
    //save basic data to session cache
})();


sdk.on('send-msg', async (content, anonymous = false) => {
    const resetGroupStatus = () => sessionStorage['sync-msg-' + groupId] = 'finished';
    const logger = new sdk.common.logger('Message Send/Thread');

    logger.info('Content=', content, 'isAnonymous=', anonymous);

    if (content.length < MSG_MIN_LIMIT) {
        logger.info('min limit');
        resetGroupStatus();
        return messagePackage.tellUser('@{chat.message_min_limit}', messagePackage.MSG_WARN);
    };
    if (content.length > MSG_MAX_LIMIT) {
        logger.info('max limit');
        resetGroupStatus();
        return messagePackage.tellUser('@{chat.message_max_limit}', messagePackage.MSG_WARN);
    };

    //insert to local db
    const tmpCursor = new Date().getTime() + '[tmp]';
    let username = sessionStorage.username, uid = sessionStorage.uid, ip = (await sdk.getClientIp()).ip;

    if (anonymous) {
        username = 'anonymous_user';
        uid = 2;
        ip = '0.0.0.0';
    };

    logger.info('Temp cursor', tmpCursor);

    //render
    window.chat_msg_lists.push({
        index: window.chat_msg_lists.length,
        cursor: tmpCursor,
        uid: uid,
        username: username,
        status: MSG_STATUS_ENUM.MSG_SENDING,
        timestamp: new Date().getTime(),
        ip: ip,
        content: content,
        location: 'Unknown'
    });

    scrollToBottom();

    const currentIndexShow = window.chat_msg_lists.length - 1; //i use requestIdleCallback, if someone insert a message between current and idle callback, the order will be mess

    //translation.translateElement(document.querySelectorAll('.message-template')[currentIndexShow]);
    //i18n

    //show ip on idle
    requestIdleCallback(updateIp.bind(this, {
        ip: (await sdk.getClientIp()).ip,
    }, window.chat_msg_lists, currentIndexShow));

    //load avatar on idle
    requestIdleCallback(loadAvatar.bind(this, sessionStorage.uid, currentIndexShow));

    const insertTempMessagePromise = sdk.local.do('msg.insert', {
        group_id: groupId,
        cType: 0,
        content: content,
        username: username,
        uid: uid,
        status: MSG_STATUS_ENUM.MSG_SENDING,
        cursor: tmpCursor,
        ts: new Date().getTime(),
        ip: ip,
        is_received: 0
    });
    //insert temp message to local db

    //send message to remote server
    const response = (await (await sdk.remote.do('msg.send', {
        msg: content,
        anonymous: anonymous,
        token: sessionStorage.user_token,
        group_id: groupId,
        ip: ip
    })).json());

    logger.info('Server response', response);

    if (response.status === 'success') {
        //send message successfully
        const msg_cursor = response.data.msg_id;

        await insertTempMessagePromise;
        //update local database
        await sdk.local.do('msg.update', {
            group_id: groupId,
            location: tmpCursor,
            cursor: msg_cursor,
            timestamp: parseInt(msg_cursor),
            status: MSG_STATUS_ENUM.MSG_SENDED
        });

        //re render
        window.chat_msg_lists[currentIndexShow].status = MSG_STATUS_ENUM.MSG_SENDED;
        window.chat_msg_lists[currentIndexShow].cursor = msg_cursor;

        //translation.translateElement(document.querySelectorAll('.message-template')[currentIndexShow]);
        //i18n

        //send to websocket
        await sdk.chatWs.send(groupId, {
            cType: 0,
            cursor: msg_cursor,
            sender: username,
            sender_uid: uid,
            msg: content,
            ip: ip,
        });


        resetGroupStatus();
    } else if (response.status === 'failure') {
        try {
            var error_code = JSON.parse(response.data.source_return).data;
        } catch (e) {
            var error_code = response.data.source_return;
        };

        resetGroupStatus();
        if (error_code === 'You have no permission to send message.')
            messagePackage.tellUser('@{chat.no_permission_to_send_message}', messagePackage.MSG_ERROR);
        else if (error_code === 'You are not in the group.')
            messagePackage.tellUser('@{chat.not_in_group}', messagePackage.MSG_ERROR);
        else if (error_code === 'You have no permission to send anonymous message.')
            messagePackage.tellUser('@{chat.no_permission_to_send_anonymous_message}')
        else sdk.throwFatalError('Server responded with error\n' + error_code);
    };
});

const MSG_STATUS_ENUM = {
    'MSG_SENDING': 1 << 0,
    'MSG_SENDED': 1 << 1,
    'MSG_RECEIVED': 1 << 2,
    'MSG_OTHER_SENDED': 1 << 3,
    'MSG_OTHER_DELETED': 1 << 4,
    'MSG_EXPIRED': 1 << 5,
    'MSG_SEND_ERROR': 1 << 6,
};

Array.prototype.unique = function () {
    return Array.from(new Set(this));
};

const getAllMessages = () => {
    return new Promise((resolve, reject) => {
        sdk.local.do('msg.query', {
            group_id: groupId,
            timestamp: 0
        }).then(response => response.json())
            .then(response => resolve(response));
    });
};

const convertDatabaseRecordToRenderView = (records) => {
    return new Promise((resolve, reject) => {
        const lists = [];
        records.forEach((record, index) => {
            lists.push({
                index: index,
                cursor: record.cursor,
                uid: record.uid,
                username: record.username,
                status: record.status,
                timestamp: record.timestamp,
                ip: record.ip,
                content: record.content,
                location: 'Unknown'
            });
            requestIdleCallback(updateIp.bind(this, record, lists, index));

        });

        window.chat_msg_lists = lists;

        resolve(lists);
    });
};

const updateIp = async (record, lists, index) => {
    const logger = new sdk.common.logger('Update IP/Client');
    logger.info('Get info for', record.ip);

    //load location when on idle
    if (record.ip === '0.0.0.0') return;
    //anonymous

    //first search from the local cache database
    var ip_record = await (await sdk.local.do('webcache.get', {
        key: 'ip/' + record.ip
    })).text();

    if (ip_record === 'error') //cache error, do not show
        return;
    if (ip_record) {
        //hit cache
        lists[index].location = ip_record;
        return;
    };

    //get ip information from the remote server
    ip_record = await (await sdk.remote.do('ip.get', {
        ip: record.ip
    })).json();

    logger.info('Get remote ip info from server', ip_record);

    if (ip_record.status === 'success' && ip_record.data && typeof ip_record.data.country !== 'undefined') ip_record = [ip_record.data.city, ip_record.data.state, ip_record.data.country]
        //make an array of records
        .filter(Boolean)
        //filter false (null)
        .unique()
        //eg. make "Shanghai, Shanghai, China" to "Shanghai, China"
        .join(', '); //split ','
    else ip_record = 'error';
    //else request error

    lists[index].location = ip_record; //display it

    sdk.local.do('webcache.set', {
        key: 'ip/' + record.ip,
        value: ip_record,
        expires_at: new Date().getTime() + 0x3f3f3f3f * 1000
        //not expires
    });
};

const dataurl2blob = fRequire('../lib/dataurl2blob.js');

let avatar_blob_cache_map = {};

// const syncMapToSessionStorage = () => {
//     if (sessionStorage.avatar_blob_cache_map) {
//         avatar_blob_cache_map = {
//             ...JSON.parse(sessionStorage.avatar_blob_cache_map),
//             ...avatar_blob_cache_map,
//         };
//     };
//     sessionStorage.avatar_blob_cache_map = JSON.stringify(avatar_blob_cache_map);
//     //syncing to sessionStorage
// };

// setInterval(syncMapToSessionStorage, 5000);
// syncMapToSessionStorage();

//it may expired

const loadAvatars = () => {
    document.querySelectorAll('.message-avatar').forEach((element, index) => {
        if (element.src.includes('unknown.png')) //not load
            requestIdleCallback(loadAvatar.bind(this, ~~element.getAttribute('data-sender'), index));
        //load avatar on idle

    });
};

const getAvatarLink = (user_uid) => {
    const logger = new sdk.common.logger('Get avatar link');


    return new Promise(async (resolve, reject) => {
        if (avatar_blob_cache_map[user_uid]) {
            logger.info(avatar_blob_cache_map[user_uid],'for user',user_uid);
            resolve(avatar_blob_cache_map[user_uid]);
            return;
        };
        //hit memory cache, load from it

        //check from the disk cache
        let data = await(await sdk.local.do('webcache.get', {
            key: 'avatar-cache-user-' + user_uid
        })).text();

        if (data === 'error') //fetch image failed
            return;

        if (data === '') {
            //cannot find in the disk
            const response = await fetch(`https://download-concatenate.deta.dev/user-avatar/${user_uid}`);
            if (response.ok) {
                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                //blob to dataurl and save to db
                reader.onload = async () => {
                    await sdk.local.do('webcache.set', {
                        key: 'avatar-cache-user-' + user_uid,
                        value: reader.result,
                        expires_at: new Date().getTime() + 1000 * 60 * 60 * 24 * 14 //save for 14 days
                    });
                    resolve(await getAvatarLink(user_uid)); //recall
                };
            } else {
                //failed to request
                const default_dataurl = await(await sdk.local.do('webcache.get', {
                    key: 'avatar-cache-group-1',
                })).text();
                await sdk.local.do('webcache.set', {
                    key: 'avatar-cache-user-' + user_uid,
                    value: default_dataurl || 'error',
                    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24 * 3 //save for 3days
                });
                resolve(await getAvatarLink(user_uid)); //recall

            };
        } else {
            const blob = dataurl2blob(data);
            const blob_url = window.URL.createObjectURL(blob);
            //make blob_url and save to cache
            avatar_blob_cache_map[user_uid] = blob_url;
            resolve(await getAvatarLink(user_uid)); //recall
        };
    });
};

const loadAvatar = async (user_uid, show_index) => {
    const logger = new sdk.common.logger('Chat Operation/Thread');
    logger.info('Loading avatar for user ' + user_uid);

    const url = await getAvatarLink(user_uid);

    if (!url) return;
    logger.info('Generating avatar blob url ', url, 'for user', user_uid);
    document.querySelectorAll('.message-avatar')[show_index].src = url;
};

const detectAllowAnonymous = async () => {
    let canAnonymous = false;
    const groupData = await (await sdk.local.do('webcache.get', {
        key: 'group-' + groupId
    })).json();

    const myPermission = getMyPermission(groupData);
    if (myPermission === MANAGER_PERMISSION) canAnonymous = true;
    if (myPermission === ADMIN_PERMISSION && groupData.permission.admin.allowAnonymous) canAnonymous = true;
    if (myPermission === DEFAULT_PERMISSION && groupData.permission.default.allowAnonymous) canAnonymous = true;

    window.inputAreaVue.state.isBannedAnonymous = !canAnonymous;

    console.log('%c Note for hackers', 'background-color: black; color: #00ff00;');
    console.log('%c If you want use debugger to hack some permissions, I suggest you giving up.', 'background-color: black; color: #00ff00;');
    console.log('%c We have permissions detect in server, and in client it\'s only convenient for user.', 'background-color: black; color: #00ff00;')
};


const DEFAULT_PERMISSION = 1, ADMIN_PERMISSION = 2, MANAGER_PERMISSION = 4;
function getMyPermission(groupData) {
    const myUserUid = ~~sessionStorage.uid;
    if (myUserUid === groupData.permission.manager) return MANAGER_PERMISSION;
    if (groupData.permission.admins.includes(myUserUid)) return ADMIN_PERMISSION;
    return DEFAULT_PERMISSION;
};

const scrollToBottom = () => {
    document.querySelector('.end-sentinel').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
    }); //scroll to bottom
};

module.exports = {
    getAllMessages,
    convertDatabaseRecordToRenderView,
    loadAvatars,
    detectAllowAnonymous,
    updateIp,
    getMyPermission,
    loadAvatars,
    loadAvatar,
    getAvatarLink,
    scrollToBottom,
    MSG_STATUS_ENUM
};
