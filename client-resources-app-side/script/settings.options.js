/**
 * @Author          : lihugang
 * @Date            : 2022-07-31 13:28:20
 * @LastEditTime    : 2022-07-31 15:02:09
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
const export_list = [
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
        value: async function() {
            return (await sdk.getConfig('user_config')).lang
        }
    },
    {
        type: 'button',
        content: '@{dict.logout}',
        inline_styles: {
            color: 'red'
        },
        bind: operation.logout,
        id: 'logout'
    }
];
module.exports = export_list;