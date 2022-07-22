/**
 * @Author          : lihugang
 * @Date            : 2022-07-22 11:06:41
 * @LastEditTime    : 2022-07-22 13:28:55
 * @LastEditors     : lihugang
 * @Description     : 
 * @FilePath        : \client-side\routers\read_config.js
 * @Copyright (c) lihugang
 * @长风破浪会有时 直挂云帆济沧海
 * @There will be times when the wind and waves break, and the sails will be hung straight to the sea.
 * @ * * * 
 * @是非成败转头空 青山依旧在 几度夕阳红
 * @Whether it's right or wrong, success or failure, it's all empty now, and it's all gone with the passage of time. The green hills of the year still exist, and the sun still rises and sets.
 */
const fs = require('fs');
const path = require('path');
module.exports = async function read_config (void_arg, map) {
    return new Promise(function (resolve, reject) {
        const { mainWindow_ptr, __storePath, fetch, logger, config_ptr, yaml, __resourcePath } = map;
        fs.readFile(path.join(
            __storePath,
            'config.yaml'
        ), async (err, data) => {
            if (err) {
                logger.warn('Failed to read config file');
                //Failed to read
                //Try update
                mainWindow_ptr.mainWindow.loadURL(path.join(__resourcePath, 'static-html', 'loading.html?Download default configuration file from the server.'));
                try {
                    var download_config_url = fs.readFileSync(path.join(__resourcePath, 'config', 'download_default_config_url.txt'));
                } catch (e) {
                    //no download config
                    var download_config_url = 'https://download-concatenate.deta.dev/clientResource/cfg';
                };
                logger.info('Download default config:', download_config_url);
                var response = await fetch(download_config_url);
                if (response.status == 200) {
                    try {
                        fs.writeFileSync(path.join(
                            __storePath,
                            'config.yaml'
                        ),response.response);
                    } catch (e) {
                        //failed to write
                        logger.error('No permission to write config.yaml');
                        reject('No permission to write config.yaml');
                    }

                } else {
                    //request error
                    logger.error('Failed to download config.yaml');
                    reject('Failed to download config.yaml');
                };
                resolve(read_config(void 0,map));
                return;
            };
            
            //read successfully
            //parse yaml
            try {
                config_ptr.config = yaml.load(data.toString()); //buffer -> string
            } catch (e) {
                //failed to parse config.yaml
                logger.error(e);
                logger.error('Failed to parse config.yaml');
                reject('Failed to parse config.yaml');
            };
            logger.info('Config',config_ptr.config);
            resolve();
        });
    })

};