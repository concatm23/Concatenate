module.exports = async function main(data = {}) {
    await getLock('insert-group');
    var records = await localforage.getItem('group-list');
    records = records || [];
    records.push({
        group_id: data.group_id,
        alias: data.alias || '',
        join_time: data.join_time || 0,
        last_read: data.last_read || 0,
        last_msg: data.last_msg || 0,
        is_on_top: data.is_on_top || 0,
        is_show: (data.is_show == undefined) ? 1 : data.is_show,
        user_uid: data.user_uid,
        group_type: data.group_type || 0,
        msg_counts: 0
    });
    await localforage.setItem('group-list', records);
    await releaseLock('insert-group');
};

function waitTime(t) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, t);
    });
};

async function getLock(lock) {
    while (sessionStorage['__lock-' + lock]) await waitTime(50);
    sessionStorage['__lock-' + lock] = 1;
};

async function releaseLock(lock) {
    sessionStorage.removeItem('__lock-' + lock);
};