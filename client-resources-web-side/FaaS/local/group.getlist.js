
module.exports = async function main(data = {}) {
    if (!(await sdk.fs.exists('group-list'))) await sdk.fs.write('group-list', null, []);

    return JSON.stringify(((await localforage.getItem('group-list')) || []).filter((val) => val.user_uid === data.uid));
};