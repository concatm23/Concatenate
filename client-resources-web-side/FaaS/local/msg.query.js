module.exports = async function main(data) {
    var records = await localforage.getItem('msg.group.' + data.group_id);
    records = records || [];
    records = records.filter((a) => a.timestamp >= data.timestamp);
    return JSON.stringify(records.sort((a,b) => a.timestamp - b.timestamp));

};