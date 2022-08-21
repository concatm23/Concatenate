
module.exports = function main(data) {
    var sql = sdk.common.getSQL('msg.insertMsgList');
    sql = sdk.common.replaceString(sql, {
        group_id: data.group_id
    });
    sdk._db.msg.prepare(sql).run({
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

    return {};
}