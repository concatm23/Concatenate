(function () {
    const prompt = async (message) => {
        const cover = document.createElement('div');
        cover.style.opacity = 0.8;
        cover.style.position = 'fixed';
        cover.style.top = '0%';
        cover.style.left = '0%';
        cover.style.height = '100%';
        cover.style.width = '100%';
        cover.style['z-index'] = 114514;
        document.body.appendChild(cover);
        //add cover
        const show = document.createElement('div');
        show.style.opacity = 1;
        show.style['float'] = 'center';
        show.style['text-align'] = 'center';
        show.style['font-size'] = '1.5em';
        show.style['z-index'] = 1919810;
        show.style.height = '120px';
        show.style.width = '100%';
        show.style['background-color'] = 'white';
        show.style['color'] = 'black';
        show.style['border'] = '2px solid gray';
        show.innerHTML = message.replaceAll('<', '&lt;').replaceAll('>', '&gt;') + '<br><input type=text style="width:80%; height:64px; font-size: 32px;" id=prompt-box><br><button id=prompt-confirm style="background-color: green; color: white; border: 1px solid gray; width: 128px; height: 64px; border-radius: 10px">Confirm</button><button id=prompt-cancel style="background-color: red; color: white; border: 1px solid gray; width: 128px; height: 64px; border-radius: 10px">Cancel</button>';
        cover.appendChild(show);

        return new Promise((resolve, reject) => {
            document.querySelector('#prompt-confirm').addEventListener('click', () => {
                resolve(document.querySelector('#prompt-box').value);
                document.body.removeChild(cover);
            });
            document.querySelector('#prompt-cancel').addEventListener('click', () => {
                resolve(null);
                document.body.removeChild(cover);
            });
        }
        )
    };
    try {
        window.prompt = prompt;
    } catch (e) { };
    try {
        module.exports = prompt;
    } catch (e) { };
})();
