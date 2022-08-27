module.exports = async function (data) {
    data.key = data.key || Math.random().toString(36).substring(2);
    data.value = data.value || '';
    data.expires_at = data.expires_at || new Date().getTime() + 3600 * 1000;
    await localforage.setItem('cache.' + data.key, {
        key: data.key,
        value: data.value,
        expires_at: data.expires_at
    });
};