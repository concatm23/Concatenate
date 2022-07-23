/**
 * @Author          : lihugang
 * @Date            : 2022-07-23 20:15:08
 * @LastEditTime    : 2022-07-23 21:22:57
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
    renderTitle: function() {
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
    renderSwitchButton: function() {
        //translate switch button alts
        translation.translate('.switch-button');
        var eles = document.querySelectorAll('.switch-button-icon');
        var space = (window.innerWidth - (48 + 4) * eles.length) / (eles.length - 1);
        
        for (var i = 0, len = eles.length; i < len; ++i) {
            eles[i].style.left = ~~(i * (space + 48)) + 'px';
            eles[i].style.bottom = '0px';
        };
    }
}