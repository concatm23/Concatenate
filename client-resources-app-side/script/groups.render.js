/**
 * @Author          : lihugang
 * @Date            : 2022-07-23 20:15:08
 * @LastEditTime    : 2022-08-20 10:44:36
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\groups.render.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = {
    renderTitle: function () {
        requestIdleCallback(translation.translatePage);
        //translation ready
        const title = new Vue({
            el: '.title',
            data: {
                app: {
                    name: translation.translate('@{app.name}')
                }
            }
        });
        //render title
        return title;
    },
    renderSwitchButton: function () {
        //translate switch button alts
        translation.translateElement('.switch-button');
        var eles = document.querySelectorAll('.switch-button-icon');
        var space = (window.innerWidth - (48 + 4) * eles.length) / (eles.length - 1);

        for (var i = 0, len = eles.length; i < len; ++i) {
            eles[i].style.left = ~~(i * (space + 48)) + 'px';
            eles[i].style.bottom = '0px';
        };
    },
    renderList: function (lists) {
        const logger = new sdk.common.logger('render task');
        //logger.filter(sdk.common.logger.ALL); //for debug

        var list_height = window.innerHeight - 38 - 48 - 20; //38: title height, 48: switch button height, 20: border
        logger.info('Viewport height',list_height);
        const one_list_height = 40;
        const can_render_lists = ~~(list_height / one_list_height) + 1; //+1 for scrollable
        logger.info('Lists on screen',can_render_lists);
        //lazy load

        var top_index = 0; // the index of the top element
        var bottom_index = 0; //the index of the bottom element

        var visible_list = [];
        for (var i = 0; i < can_render_lists; ++i) {
            if (!lists[i]) {
                //not exists, reach limits
                break;
            };
            visible_list.push({
                img_src: 'unknown.png',
                id: lists[i][0],
                name: lists[i][0],
                last_msg: new Date(lists[i][1].last_msg || 0).toISOString(),
                new_message_counts: lists[i][1].msg_counts || 0,
                list_id: i,
            });
            bottom_index = i;
        };
        //lists -> Array.from 
        /*
        [
            [1, {}],
            [2, {}],
            ...
        ]
        */
        logger.debug('Vue render');
        var vue_render_lists = new Vue({
            el: '.groups-list',
            data: {
                visible_list: visible_list
            },
            methods: {
                enterGroup: function(e) {
                    var id = e.target.getAttribute('data-id'); //if click the div box
                    if (!id) {
                        //click the son element
                        id = e.target.parentNode.getAttribute('data-id');
                    };
                    sdk.publish('user-enter-group', id);
                },
            },
        });
        

        //watch scroll
        var watcher = new IntersectionObserver(function (e) {
            logger.debug('intersection observer event emit');
            watcher_emit_times++;
            if (watcher_emit_times > 10) {
                //over 10 emits in 5s
                //rate limit
                watcher.unobserve(top_sentinel);
                watcher.unobserve(bottom_sentinel);
                
                logger.warn('Too much intersection observer event emit.');

                //watch after 20s
                setTimeout(function() {
                    watcher.observe(top_sentinel);
                    watcher.observe(bottom_sentinel);
                },20000);

                return;
            };
            e.forEach(function(e){
                if (e.target == bottom_sentinel) {
                    for (var i = 0; i < 5; i++) { //load 5 list one time
                        if (lists[bottom_index + 1]) {
                            logger.info('load list',lists[bottom_index + 1],bottom_index + 1);
                            //not reach limits
                            bottom_index++;
                            vue_render_lists.visible_list.push({
                                img_src: 'unknown.png',
                                id: lists[bottom_index][0],
                                name: lists[bottom_index][0],
                                last_msg: new Date(lists[bottom_index][1].last_msg || 0).toISOString(),
                                new_message_counts: lists[bottom_index][1].msg_counts || 0,
                                list_id: bottom_index,
                                id: lists[bottom_index][0]
                            });
                        } else break;
                    };
                };
            });

            sdk.publish('user-group-list-update');//emit event
        });

        var watcher_emit_times = 0;
        //record watcher emit times(to prevent too much events)
        setInterval(function() {
            watcher_emit_times = 0; //reset every 5s
        },5000);

        const top_sentinel = document.querySelector('#top-sentinel');
        const bottom_sentinel = document.querySelector('#bottom-sentinel');
        watcher.observe(top_sentinel);
        watcher.observe(bottom_sentinel);

        return vue_render_lists.visible_list;
    },
    renderButtons () {
        // window.buttonsVue = new Vue({
        //     el: '.new-group',
        //     methods: {
        //         new_group: function() {
        //             sdk.publish('new-group');
        //         }
        //     }
        // });
        translation.translateElement('.new-group');
    }
};