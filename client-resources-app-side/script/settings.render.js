/**
 * @Author          : lihugang
 * @Date            : 2022-07-23 20:15:08
 * @LastEditTime    : 2022-08-18 20:44:57
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
const renderMenu = async function (arr) {
    console.log(arr);
    const logger = new sdk.common.logger('render menu');

    arr.display = arr.display || [];
    for (var i = 0; i < arr.display.length; ++i) {

        arr.display[i].index = i;
        arr.display[i].options = arr.display[i].options || {};
        arr.display[i].inline_styles = arr.display[i].inline_styles || {};

                //calc values
        if (arr.display[i].content instanceof Function) arr.display[i].content = await arr.display[i].content();
        arr.display[i].content = translation.translate(arr.display[i].content || '');
        if (arr.display[i].value instanceof Function) arr.display[i].value = await arr.display[i].value();
        if (arr.display[i].src instanceof Function) arr.display[i].src = await arr.display[i].src();
    };

    for (key in arr) {
        const value = arr[key];
        value['pointer-to-parent'] = arr;
    };

    logger.info(arr);
    if (window.settings_vue) {
        //exists
        //reset
        document.querySelector('.settings').innerHTML = window.settings_raw_html;
    };
    window.settings_raw_html = document.querySelector('.settings').innerHTML;
    //save template and can reset it

    window.settings_vue = new Vue({
        el: '.settings',
        data: {
            data: {
                display: arr
            },
        },
        methods: {
        }
    });
    translation.translatePage();

    //because of some bug, vue cannot bind click events
    //use native codes

    document.querySelectorAll('.settings-select').forEach((element) => {
        var index = ~~element.parentNode.getAttribute('data-index');
        element.addEventListener('change', (event) => {
            if (arr.display[index].bind) arr.display[index].bind(element.value, arr.display[index], index, element);
        });
        element.value = arr.display[index].value || '';
    });

    document.querySelectorAll('.settings-checkbox').forEach((element) => {
        var index = ~~element.parentNode.getAttribute('data-index');
        element.addEventListener('change', (event) => {
            if (arr.display[index].bind) arr.display[index].bind(element.value, arr.display[index], index, element);
        });
        element.value = arr.display[index].value || '';
    });

    document.querySelectorAll('.upload-image-button').forEach((element) => {
        var index = ~~element.getAttribute('data-index');
        element.addEventListener('change', (event) => {
            if (arr.display[index].bind) arr.display[index].bind(element.files, arr.display[index], index, element);
        });
    });

    document.querySelectorAll('.settings-text-box').forEach((element) => {
        var index = ~~element.getAttribute('data-index');
        element.value = arr.display[index].value || '';
    });

    document.querySelectorAll('.settings-content').forEach((element) => {
        var index = ~~element.parentNode.getAttribute('data-index');
        if (arr.display[index].type === 'button') {
            element.addEventListener('click', (event) => {
                if (arr.display[index].enter) {
                    //enter sub menu
                    renderMenu(arr[arr.display[index].enter]);
                } else
                    if (arr.display[index].bind) arr.display[index].bind(element.value);
            });
            element.style.cursor = 'pointer'; //s
        };
    });

    document.querySelectorAll('.settings-image').forEach((element) => {
        element.addEventListener('click', (event) => {
            //Trying to download
            var index = ~~element.parentNode.getAttribute('data-index');
            var a = document.createElement('a');
            a.href = element.src;
            a.download = arr.display[index].content;
            a.click();
        });
    });

    if (document.querySelector('#back-button'))
        document.querySelector('#back-button').addEventListener('click', () => {
            renderMenu(arr['pointer-to-parent']);
        });

    console.log(arr);
};

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
        this.renderMenu(arr);
    },
    renderMenu: renderMenu

};