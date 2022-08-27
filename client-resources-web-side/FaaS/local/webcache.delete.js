module.exports = async function (data) {
    await localforage.removeItem('cache.' + data.key);
};