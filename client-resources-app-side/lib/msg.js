/**
 * @Author          : lihugang
 * @Date            : 2022-05-05 11:36:52
 * @LastEditTime    : 2022-07-22 20:56:33
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : c:\Users\heche\AppData\Roaming\concatenate.pz6w7nkeote\resources\lib\msg.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
function showMessageBox(message, options) {
    var color = [,
        '#32cd32', //MSG_SUCCESS
        '#f0e68c', //MSG_WARN
        '#ff0000', //MSG_ERROR
        '#00bfff', //MSG_INFO
    ];
    var box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.width = 10 * message.length + 'px';
    box.style.height = '24px';
    box.style.top = '5px';
    box.innerHTML = '<b>' + message + '</b>';
    box.style['background-color'] = 'white';
    box.style.border = '2px dotted ' + color[options];
    box.style['border-radius'] = '10px';
    box.style['font-size'] = '0.8em';
    box.style['text-align'] = 'center';
    box.style['opacity'] = 0.8;
    box.style['right'] = '2px';
    box.style['color'] = 'rgb(0,0,0)';
    box.className = 'msgBox';

    setTimeout(function () {
        document.body.removeChild(box);
        //remove message in 10s

        msb_removeMessageListener(func_id);
        //remove listener
    }, 10 * 1000);
    for (var i = 0; i < _msb_messagelistener.length; i++) {
        _msb_messagelistener[i]();
    };
    //publish event

    if (_msb_messagelistener.length) {
        setTimeout(function () {
            document.body.appendChild(box);
            var sti = setInterval(function () {
                box.style['top'] = parseInt(box.style['top']) + 1 + 'px';
                //new message down 1px per 1/25s(40ms) move to normal position top:30px
            }, 40);
            setTimeout(function () {
                clearInterval(sti);
            }, 1000);
        }, 1080);
        //show message in 1.08s
    } else {
        // if length(listener) = 0 no bind message, is the first message, no sending delay
        document.body.appendChild(box);
        var sti = setInterval(function () {
            box.style['top'] = parseInt(box.style['top']) + 1 + 'px';
            //new message down 1px per 1/25s(40ms) move to normal position top:30px
        }, 40);
        setTimeout(function () {
            clearInterval(sti);
        }, 1000);
    }
    func_id = msb_addMessageListener(function () {
        var sti = setInterval(function () {
            box.style['top'] = parseInt(box.style['top']) + 1 + 'px';
            //When receiving new message，old messages down 1px per 1/40s(25ms)（make room for new message）
        }, 25);
        setTimeout(function () {
            clearInterval(sti);
            //stop in 1s
        }, 1000);
    });
};

function msb_addMessageListener(func) {
    window._msb_messagelistener.push(func);
    return window._msb_messagelistener.length - 1;
};

function msb_removeMessageListener(id) {
    window._msb_messagelistener.splice(id, 1);
}
window._msb_messagelistener = [];
const MSG_SUCCESS = 1;
const MSG_WARN = 2;
const MSG_ERROR = 3;
const MSG_INFO = 4;

function tellUser(msg, status) {
    msg = translation.translate(msg);
    if (typeof (status) == 'undefined' || !status) {
        status = MSG_INFO;
    }
    showMessageBox(msg, status);
};

module.exports = {
    tellUser,
    MSG_SUCCESS,
    MSG_WARN,
    MSG_ERROR,
    MSG_INFO
};