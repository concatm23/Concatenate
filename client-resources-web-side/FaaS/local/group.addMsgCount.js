module.exports = async function main(data = {}) {
    var records = await localforage.getItem('group-list');
    records = records || [];
    records.forEach((val) => {
        if (val.group_id === data.group_id && val.user_uid === data.uid) val.msg_counts += data.counts;
    });
    await localforage.setItem('group-list', records);
};