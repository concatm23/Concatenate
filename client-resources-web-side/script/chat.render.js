/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 22:06:36
 * @LastEditTime    : 2022-08-19 15:56:35
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\chat.render.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */

const group_id = location.search.substring(1);
const logger = new sdk.common.logger('Chat/Render Thread');
let openSyncStatus = sessionStorage.getItem('sync-msg-' + group_id) || 'null';
module.exports = {
    renderTitle: function () {
        const title = new Vue({
            el: '.title',
            data: {
                data: {
                    title: sessionStorage.getItem('group-alias-' + group_id), //read from the cache,
                    status: '',
                },
                //vue not support edit the elements in the root, (may be due to transfering value of number,string and transfering pointer of array,object in JavaScript)
            },
            methods: {
                back_page: function () {
                    //return to the list
                    sdk.publish('ui-back-page');
                },
                refresh: function () {
                    this.refresh = false;
                    this.$nextTick(() => {
                        //when the dom element rendered
                        this.refresh = true;
                    });
                },
                updateStatus() {
                    const currentStatus = sessionStorage.getItem('sync-msg-' + group_id) || 'null';
                    //using map instead of if to improve read performance and efficiency
                    const statusText = ({
                        'null': '@{chat.syncing_chat_history_waiting_queue}',
                        'pending': '@{chat.syncing_chat_history}',
                        'sending': '@{chat.sending_message}',
                        'finished': ''
                    })[currentStatus] ?? 'Unknown Status';
                    //logger.info('Setting title status  ', currentStatus, statusText);
                    this.data.status = statusText;
                    //vue does not render
                    //native api calls

                    if ((openSyncStatus === 'pending' || openSyncStatus === 'null') && currentStatus === 'finished') {
                        //pending/waiting -> sending
                        //refresh the page to load contents
                        logger.info(openSyncStatus,currentStatus, 'reload the page');
                        location.reload();
                    };

                    document.querySelector('.group-status').innerText = translation.translate(statusText);
                },
            },
            mounted: function () {
                window.refreshTitle = this.refresh;
                //expose refresh method to the window/global

                const updateTitleStatusAsync = () => {
                    setTimeout(this.updateStatus, 0);
                    requestAnimationFrame(updateTitleStatusAsync);
                };
                requestAnimationFrame(updateTitleStatusAsync);


            },
        });


        //render title
        window.titleVue = title;

        //translate the element
        translation.translateElement('.title');

        document.querySelector('.back-icon').addEventListener('click', () => {
            //i don't know why Vue does not listen to click events
            //using native
            sdk.publish('ui-back-page');
        });
    },

    renderInputArea: () => {
        window.inputAreaVue = new Vue({
            el: '.operations',
            data: {
                content: '',
                state: {
                    isSyncingMessage: sessionStorage['sync-msg-' + group_id] !== 'finished',
                    isBannedAnonymous: true,
                    isChattingAnonymous: false,
                    isCouldInviteMember: false,
                    isCouldKickMember: false,
                    isCouldEditAlias: false,
                }
            },
            methods: {
                clear_content() {
                    this.content = '';
                },
                send_msg() {
                    sessionStorage['sync-msg-' + group_id] = 'sending';
                    sdk.publish('send-msg', this.content, this.state.isChattingAnonymous);
                    this.clear_content();
                },
                delete_msg() {
                    console.log('Delete message');
                },
                refreshSyncingState() {
                    this.state.isSyncingMessage = sessionStorage['sync-msg-' + group_id] !== 'finished';
                },
                invite_member () {
                    sdk.publish('invite-member');
                },
                kick_member () {
                    sdk.publish('kick-member');
                },
                edit_alias () {
                    sdk.publish('edit-alias');
                },
            },
            mounted() {
                setInterval(() => {
                    this.refreshSyncingState();
                }, 50);
            }
        })
    },
    renderMessage (messages) {
        window.messageAreaVue = new Vue({
            el: '.messages',
            data: {
                show_msgs: messages
            },
            methods: {
                download_avatar(e) {
                    const a = document.createElement('a');
                    a.href = e.target.src;
                    a.download = translation.translate('@{dict.avatar}');
                    a.click();
                },
            }
        });
        sdk.publish('chat-page-loaded');
    },
};