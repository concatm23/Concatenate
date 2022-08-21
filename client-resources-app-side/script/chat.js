/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 20:43:47
 * @LastEditTime    : 2022-08-19 15:56:55
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\chat.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function() {
    const render = fRequire('../script/chat.render.js');
    const operation = fRequire('../script/chat.operation.js');
    render.renderTitle();

    render.renderInputArea();

    operation.getAllMessages()
    .then(messages => operation.convertDatabaseRecordToRenderView(messages))
    .then(lists => render.renderMessage(lists));

    sdk.on('chat-page-loaded', operation.loadAvatars);
    sdk.on('chat-page-loaded', operation.detectAllowAnonymous);
    sdk.on('chat-page-loaded', operation.detectAllowInviteMember);
    sdk.on('chat-page-loaded', operation.detectAllowKickMember);
    sdk.on('chat-page-loaded', operation.detectAllowEditAlias);
    sdk.on('chat-page-loaded', operation.scrollToBottom);
};