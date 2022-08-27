module.exports = async function (data) {
    var res = await localforage.getItem('cache.' + data.key);
    if (!res) return '';
    if (res.expires_at < new Date().getTime()) {
        localforage.removeItem('cache.' + data.key);
        return '';
    };
    return res.value;
};