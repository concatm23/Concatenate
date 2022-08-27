
module.exports = async function main(data) {
    try {
        if (await sdk.fs.exists('group.' + data.group_id)) sdk.fs.write('group.' + data.group_id, null, []);
    } catch (e) {
        return e.message + '\n' + e.stack;
    };
    return 'ok';
};