/**
 * @Author          : lihugang
 * @Date            : 2022-07-23 20:15:08
 * @LastEditTime    : 2022-07-31 15:06:52
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\script\settings.render.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
module.exports = {
    renderTitle: function () {
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
    renderContent: async function (arr) {
        const logger = new sdk.common.logger('render content');
        const promise_list = [];
        for (var i = 0; i < arr.length; ++i) {

            arr[i].index = i;
            arr[i].options = arr[i].options || {};
            arr[i].inline_styles = arr[i].inline_styles || {};

            //calc values
            if (arr[i].value instanceof Function) arr[i].value = await arr[i].value();
        };
        logger.info(arr);
        const settings_vue = new Vue({
            el: '.settings',
            data: {
                settings_list: arr
            },
        });
        translation.translatePage();

        //because of some bug, vue cannot bind click events
        //use native codes

        document.querySelectorAll('.settings-template').forEach((val) => {
            val.addEventListener('click', () => {
                const index = ~~val.getAttribute('data-index');
                if (arr[index].bind) arr[index].bind(); //emit bind events
            });
        });

        document.querySelectorAll('select').forEach((val) => {
            val.addEventListener('change', (e) => {
                const index = ~~val.parentNode.getAttribute('data-index');
                if (arr[index].bind) arr[index].bind(val.value);
            });
            const index = ~~val.parentNode.getAttribute('data-index');
            val.value = arr[index].value || '';
        });

        console.log(arr);
    }
};