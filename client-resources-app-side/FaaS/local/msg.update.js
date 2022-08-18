
module.exports = function main(data) {
    var txt = '';
    for (var key in data) {
        if (key == 'location') continue;
        if (key == 'group_id') continue;
        if (typeof data[key] === 'string') txt += `${key} = '${data[key]}', `;
        else txt += `${key} = ${data[key]}, `;
    };
    var location = data.location;
    txt = txt.substring(0, txt.length - 2);
    try {
        sdk._db.msg.prepare(`UPDATE group${data.group_id} SET ${txt} WHERE cursor = '${location}'`).run({
        });
    } catch (e) {
        throw JSON.stringify({
            err_sql: `UPDATE group${data.group_id} SET ${txt} WHERE cursor = '${location}'`,
            err_text: e.toString()
        });
    };

};