
/**
 * @Author          : lihugang
 * @Date            : 2022-07-24 16:19:31
 * @LastEditTime    : 2022-07-31 20:03:00
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\groups.operation.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */

function ergodic_elements_request_idle(func, timeout = 5000) {
    //ergodic the elements and request idle run task
    const logger = new sdk.common.logger('Group operation task idle request');
    var elements = document.querySelectorAll('.group-list-template');
    var start_time = new Date().getTime(); //control repeating time (50ms), not blocking the render
    const MAX_REPEATING_TIME = 50;
    for (var i = elements.length - 1; i >= 0; i--) { //load from the end
        if (new Date().getTime() - start_time > MAX_REPEATING_TIME) {
            logger.warn('Group list loading alias task setup timeout');
            return;
        };
        const task_id = ~~(elements[i].getAttribute('id').substring('group'.length)); //get group id
        const alias = ~~(elements[i].querySelector('.group-list-name').innerText); //get alias
        if (~~alias == 0) continue; //already load
        requestIdleCallback( //run when the browser is idle
            func.bind(this, task_id) //bind args
            ,
            {
                timeout: timeout //must run in timeout ms
            });

        logger.debug('idle callback', task_id);

    };
};

module.exports = {
    unique: async function (local_list, remote_list) {
        //unique local_list and remote_list
        var map = new Map(); //using map to unique

        const usrData = await sdk.fs.read('usr');
        const uid = JSON.parse(usrData).uid;
        //user uid

        for (var i = 0, len = local_list.length; i < len; ++i) {
            //each local list (key: element.group_id)
            map.set(local_list[i].group_id, local_list[i]);
        };
        //local list has more details, read it firstly
        for (var i = 0, len = remote_list.length; i < len; ++i) {
            if (!map.has(remote_list[i])) { //not has, sync it
                //key: element
                //no details
                map.set(remote_list[i], {}); //null object
                //insert remote group information to the local database
                sdk.local.do('group.insert', {
                    user_uid: uid,
                    group_id: remote_list[i],
                    is_on_top: (remote_list[i] == 1) ? 1 : 0 //the group id 1 (Concatenate Official Feedback or issues group) must on the top
                    //default not on top
                }); //insert async
            };
        };

        //map to array and return it
        return Array.from(map);
    },
    sort: function (list) {
        //sort list first filter not show, then sort by is_on_top desc, finally sort by last_msg desc
        list = list.filter(function (item) {
            return !(item[1].is_show == 0);
            //if is_show == 0, not show
            //if is_show == undefined or is_show == null, show it
        });

        list.sort(function (a, b) {
            if (a[0] == 1) return -1;
            //the group id 1 (Concatenate Official Feedback or issues group) must be on the top

            a[1].is_on_top = a[1].is_on_top || false;
            b[1].is_on_top = b[1].is_on_top || false;
            a[1].last_msg = a[1].last_msg || 0;
            b[1].last_msg = b[1].last_msg || 0;
            //set default value

            if (a[1].is_on_top == b[1].is_on_top) {
                //same top level
                //order by the last_msg time desc
                return b[1].last_msg - a[1].last_msg
            } else {
                //Different level
                if (!a[1].is_on_top) return 1; //b is on the top
                else return -1; //a is on the top
            };
        });

        return list;
    },
    loadAlias: async function loadAlias() {
        const logger = new sdk.common.logger('Group operation load alias task');

        //logger.filter(sdk.common.logger.ALL); //for debug

        logger.debug('call function');

        sessionStorage.uid = JSON.parse(await (sdk.fs.read('usr'))).uid; //keep in memory without reading memory too often

        sdk.once('user-group-list-update', loadAlias); //listening to task once, when next executing this function, this listener will be registered again. So that there is always only a listener

        ergodic_elements_request_idle(loadGroupAlias, 5000);

        async function loadGroupAlias(id) {
            logger.info('Load alias', id);
            logger.debug(id, 'searching from the local list db');
            var result = await sdk.local.do('group.querylist', {
                uid: sessionStorage.uid,
                group_id: id
            }); //search from the local database (first from the local list db)
            result = await result.json();
            if (result.alias && result.alias != '' && result.alias != id.toString()) {
                logger.debug(id, 'finished');
                //find alias name
                //load it
                const index = ~~(document.querySelector(`#group${id}`).getAttribute('data_index'));
                //get the index of the list

                const object = window.render_list[index];
                object.name = result.alias;
                //set the alias

                //cache to sessionStorage
                sessionStorage.setItem('group-alias-' + id, result.alias);

                return;
            } else logger.debug(id, 'not find in local list db');

            logger.debug(id, 'searching from the web cache');
            result = await sdk.local.do('webcache.get', {
                key: 'group-' + id
            }); //search from the local database (next from the local cache db)
            result = await result.text();

            if (result === 'error') {
                logger.debug(id, 'find error');
                //cache: cannot load the group info
                //give up
                return;
            };

            result = JSON.parse(result || '{}');

            if (result.name && result.name != '') {
                logger.debug(id, 'finish');
                //find alias name
                const index = ~~(document.querySelector(`#group${id}`).getAttribute('data_index'));
                //get the index of the list

                const object = window.render_list[index];
                object.name = result.name; //set the alias

                //cache to sessionStorage
                sessionStorage.setItem('group-alias-' + id, result.name);

                return;
            } else logger.debug(id, 'not find in local web cache');

            //find local no results
            //fetch from the Internet

            logger.debug(id, 'searching from the remote database');
            var result = await sdk.remote.do('group.getinfo', {
                gid: id //group id
            });
            result = await result.json();
            logger.trace(result);
            if (result.status !== 'success') {//not success
                logger.debug(id, 'not find in remote database');
                return (await sdk.local.do('webcache.set', {
                    //save error to cache
                    key: 'group-' + id,
                    value: 'error'
                }));
            };

            result = result.data;
            if (!result || !result.name) {
                //doesn't has a key result.name
                //fetch error
                //save it to cache
                logger.debug(id, 'not find in local web cache');
                sdk.local.do('webcache.set', {
                    key: 'group-' + id,
                    value: 'error'
                });
                return;
            };

            //save to cache
            await sdk.local.do('webcache.set', {
                key: 'group-' + id,
                value: JSON.stringify(result),
                expires_at: new Date().getTime() + 1000 * 60 * 60 * 3 //expires in 3 hrs
            });

            logger.debug(id, 'finish');
            //find alias name
            const index = ~~(document.querySelector(`#group${id}`).getAttribute('data_index'));
            //get the index of the list

            const object = window.render_list[index];
            object.name = result.name; //set the alias

            //cache to sessionStorage
            sessionStorage.setItem('group-alias-' + id, result.name);
            return;
        };
    },
    loadAvatar: function loadAvatar() {
        const logger = new sdk.common.logger('Group operation load avatar task');

        sdk.once('user-group-list-update', loadAvatar); //listening to task once, when next executing this function, this listener will be registered again. So that there is always only a listener

        ergodic_elements_request_idle(loadAvatarTask, 20000);

        async function loadAvatarTask(id) {
            logger.info('Load avatar', id);
            //first get from the cache
            var result = await sdk.local.do('webcache.get', {
                key: 'avatar-cache-group-' + id
            });
            result = await result.text();
            if (result !== '') {
                const blob = dataurl2blob(result); //create blob from the base64 encoding
                const url = URL.createObjectURL(blob);

                logger.info('load url', id, url);

                const index = ~~(document.querySelector(`#group${id}`).getAttribute('data_index'));
                //get the index of the list

                const object = window.render_list[index];
                object.img_src = url; //set the url
                return;
            };

            //cannot load from the cache
            //get url
            result = await sdk.local.do('webcache.get', {
                key: 'group-' + id
            });
            result = await result.text();
            if (result === '') {
                //fetch group info cache error
                //waiting for load alias task to set cache
                requestIdleCallback(loadAvatarTask.bind(this, id));
                return;
            };
            result = JSON.parse(result);

            const url = result.avatar || '';//get avatar url
            if (url === '') return; //bad url

            result = await fetch(url); //fetch image
            if (!result.ok) {
                logger.warn('fetch error', id, url);
                //cannot load
                return;
            };
            result = await result.blob();
            //get blob

            //convert blob to dataurl
            const reader = new FileReader();
            reader.readAsDataURL(result);

            reader.onload = async function () {
                await sdk.local.do('webcache.set', {
                    //cache result
                    key: 'avatar-cache-group-' + id,
                    value: reader.result,
                    expires_at: new Date().getTime() + 86400 * 3 * 1000 //expires in 3 days
                });

                logger.info('load successfully', id);
                loadAvatarTask(id);
            };


        };
    }, 
    syncMessage: function (list) {
        const func = fRequire('../script/groups.syncMessage.js');
        var map = new Map(list);
        map.forEach((val,key) => {
            requestIdleCallback(func.bind(this,key));
        });
    }
};