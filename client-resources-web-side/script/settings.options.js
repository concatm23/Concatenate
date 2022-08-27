/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 13:28:20
 * @LastEditTime    : 2022-08-27 13:00:10
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\settings.options.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const operation = fRequire('../script/settings.operation.js');
const { getAvatarLink } = fRequire('../script/chat.operation.js');

const export_list = {
    back: false,
    profile: {
        back: true,
        'pointer-to-parent': null,
        display: [
            {
                type: 'text',
                content: '@{dict.username}',
                value: async function() {
                    return JSON.parse((await sdk.fs.read('usr'))).username
                },
                readonly: true,
                id: 'username-show-box',
            },
            {
                type: 'text',
                content: '@{dict.uid}',
                value: async function () {
                    return JSON.parse((await sdk.fs.read('usr'))).uid
                },
                readonly: true,
                id: 'uid-show-box'
            },
            {
                type: 'image',
                content: '@{dict.avatar}',
                src: async function() {
                    return await getAvatarLink(JSON.parse((await sdk.fs.read('usr'))).uid)
                },
                edit: true,
                id: 'avatar-show',
                bind: operation.uploadUserAvatar
            },
        ],
    },
    display: [
        {
            type: 'button',
            content: '@{dict.profile}',
            id: 'profile',
            enter: 'profile'
        },
        {
            type: 'select',
            content: '@{dict.language}',
            id: 'language-select',
            options: [
                {
                    show: 'English',
                    name: 'en_US'
                },
                {
                    show: 'Simplified Chinese',
                    name: 'zh_CN'
                },
                {
                    show: 'Traditional Chinese',
                    name: 'zh_TW'
                }
            ],
            bind: operation.changeLanguage,
            value: async function () {
                return (await sdk.getConfig('user_config')).lang
            }
        },
        {
            type: 'button',
            content: '@{settings.clear_cache}',
            inline_styles: {
                color: 'red'
            },
            bind: operation.clearCache,
            id: 'clear_cache'
        },
        {
            type: 'button',
            content: '@{dict.logout}',
            inline_styles: {
                color: 'red'
            },
            bind: operation.logout,
            id: 'logout'
        },
        {
            type: 'button',
            content: '@{settings.quitAPP}',
            inline_styles: {
                color: 'red'
            },
            bind: operation.quitAPP,
            id: 'quit-app'
        },
        {
            type: 'button',
            content: '@{dict.about}',
            bind: operation.about,
            id: 'about'
        },
    ],
};
module.exports = export_list;