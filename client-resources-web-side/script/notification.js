/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 11:59:34
 * @LastEditTime    : 2022-07-31 12:22:53
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\notification.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const blob_url_cache = new Map();
const msg_notice = fRequire('../lib/msg.js');
var last_notification_time = 0;
var last_notification = null;
module.exports = {
    notice: async function (group_id, sender_name, msg_details) {
        if (last_notification) last_notification.close(); //close last notification
        var isSilent = (new Date().getTime() - last_notification_time) < 10 * 1000; //notice user at least 10s once 
        !isSilent && (last_notification_time = new Date().getTime());
        //if the notification is not silent, reset the time
        
        const group_alias = sessionStorage.getItem('group-alias-' + group_id) || group_id; //if group alias not found , using group id instead

        var icon_url = blob_url_cache.get(group_id); //get icon url cache
        if (!icon_url) {
            //not cache
            //get url from the webcache
            var result = await sdk.local.do('webcache.get', {
                key: 'avatar-cache-group-' + group_id
            });
            result = await result.text();
            if (result === '') {
                //not group details in the cache
                //give up the icon
                icon_url = undefined;
            } else {
                const blob = dataurl2blob(result); //create blob from the base64 encoding
                icon_url = URL.createObjectURL(blob);
                blob_url_cache.set(group_id, icon_url); //cache it
            };
        };
        last_notification = new Notification(translation.translate(`@{notification.newMsg} | ${group_alias}`),{
            silent: isSilent,
            body: `${sender_name}:${
                (msg_details.length > 15)?
                (msg_details.substring(0,12) + '...'):
                (msg_details)
                //show the first 12 chars in order to prevent the notification too long
            }`,
            icon: icon_url
        });

        if (Notification.permission != 'granted') {
            //if user not allowed notification, show a msg box in the page
            msg_notice.tellUser(translation.translate(`<b>@{notification.newMsg} | ${group_alias} </b><br>${sender.name}:${(msg_details.length > 15) ? (msg_details.substring(0, 12) + '...') : msg_details}`));
        }
    },
    requestPermission: function() {
        Notification.requestPermission(function (status) {
            //request notification permission
            if (status !== 'granted') {
                msg_notice.tellUser('@{notification.requestPermission}');
            };
        });
    }
}