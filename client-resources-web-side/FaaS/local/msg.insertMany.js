
module.exports = async function (data) {
    var promise_list = [];
    for (var i = 0, len = data.length; i < len; ++i) {
        promise_list.push(sdk.local.do('msg.insert', data[i]));
    };
    const list = await Promise.all(promise_list);
    list.forEach((item) => {
        if (item.status === 'error') throw item.json();
    });
};