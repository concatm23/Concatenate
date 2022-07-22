/*
 * @Author          : lihugang
 * @Date            : 2022-07-22 09:39:02
 * @LastEditTime    : 2022-07-22 09:40:12
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\routers\check_internet
 * Copyright (c) lihugang
 * 长风破浪会有时 直挂云帆济沧海
 * There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 *  * * * 
 * 是非成败转头空 青山依旧在 几度夕阳红
 * Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const ia = require('internet-available'); //Check internet connected
module.exports = async function check_internet(first_run, map) {
    const { isOnline_ptr, logger } = map;
    return new Promise(function (resolve, reject) {
        ia({
            timeout: 2000,
            retries: 3,
            port: 53,
            host: '8.8.8.8',
            domainName: 'concatenate.deta.dev'
            //try dns
        }).then(res => {
            isOnline_ptr.online = true;
            logger.info('isOnline', true);
            resolve({
                first_run: first_run,
                isOnline: true
            });
        }).catch(err => {
            isOnline_ptr.online = true;
            logger.info('isOnline', false);
            logger.error('Please check your Internet connection.');
            reject('Please check your Internet connection.');
        })
    })
}
