module.exports = async function main(data) {
    console.trace('Msg insert', data);
    await getLock('msg.group.' + data.group_id);
    console.log('msg.group.' + data.group_id, 'Get lock');
    var records = await localforage.getItem('msg.group.' + data.group_id);
    records = records || [];
    records.push({
        cType: data.cType || 0,
        content: data.content,
        username: data.username,
        uid: data.uid,
        status: data.status,
        cursor: data.cursor,
        timestamp: data.ts || new Date().getTime(),
        ip: data.ip,
        is_received: data.is_received || 0
    });
    const unique_set = new Set();
    const results = [];
    records.forEach(record => {
        if (!unique_set.has(record.cursor)) {
            unique_set.add(record.cursor);
            results.push(record);
        };
    });
    await localforage.setItem('msg.group.' + data.group_id, results);
    console.info('Save data', data);
    await releaseLock('msg.group.' + data.group_id);
    console.log('msg.group.' + data.group_id, 'Release lock');

    return {};
};

function waitTime(t) {
    return new Promise(function(resolve, reject) {
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