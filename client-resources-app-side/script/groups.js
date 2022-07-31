/**
 * @Author          : lihugang
 * @Date            : 2022-07-23 20:14:51
 * @LastEditTime    : 2022-07-31 12:40:15
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\groups.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = function () {
    sdk.on('translation-finish-loading', async function () {
        const renders = fRequire('../script/groups.render.js');
        const fetch_data = fRequire('../script/groups.fetch.js');
        const operations = fRequire('../script/groups.operation.js');

        window.dataurl2blob = fRequire('../lib/dataurl2blob.js');

        const logger = new sdk.common.logger('Groups Script');
        logger.filter(sdk.common.logger.DEBUG);

        logger.info('Rendering title');
        renders.renderTitle();

        logger.info('Rendering switch button');
        renders.renderSwitchButton();

        logger.info('Getting groups information');
        var lists = await Promise.all([
            fetch_data.local(),
            fetch_data.remote()
        ]); //fetch group list data from local and remote server
        logger.debug('groups lists',lists);
        
        logger.info('Unique lists');
        lists = await operations.unique(lists[0], lists[1]);
        logger.debug('Unique result',lists);

        logger.info('Sort lists');
        lists = operations.sort(lists);
        logger.debug('Sort result',lists);

        logger.info('Rendering list');
        window.render_list = renders.renderList(lists);

        sdk.on('user-enter-group', function(id) {
            logger.info('User enter group',id);
        });

        operations.loadAlias();
        operations.loadAvatar();

        const notification = fRequire('../script/notification.js');
        notification.requestPermission();

        const msg = fRequire('../script/message.js');
        msg.set('notification', notification.notice); //bind notice function to the message callback

        msg.init(lists); //create socket and listen
    });
};