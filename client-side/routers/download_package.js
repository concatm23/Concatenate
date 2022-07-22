const fs = require('fs');
const path = require('path');
module.exports = async function download_package(void_arg, map) {
    return new Promise(async function (resolve, reject) {
        const { __update_resource_path, fetch, __resourcePath, logger } = map;
        try {
            var current_version_update_time = ~~(fs.statSync(__update_resource_path).mtime.getTime() / 1000);
        } catch (e) {
            //failed to read
            //download
            await download(map);
        };

        try {
            var remote_version_get_ts_link = fs.readFileSync(path.join(
                __resourcePath,
                'config',
                'get_package_ts.txt'
            ));
        } catch (e) {
            var remote_version_get_ts_link = 'https://download-concatenate.deta.dev/clientResource/latestReleaseUpdateTime'
        };

        const remote_version_update_time = ~~((await fetch(remote_version_get_ts_link)).response);
        if (remote_version_update_time == 0) {
            //parse failed
            logger.error('Failed to get latest release update time.');
            reject('Failed to get latest release update time.');
        };
        if (current_version_update_time < remote_version_update_time) {
            //current up to date
            //update package
            await download(map);
        };
        resolve();
    });
};

const download = async function (map) {
    const {__resourcePath, download_file, __update_resource_path, logger, mainWindow_ptr} = map;
    mainWindow_ptr.mainWindow.loadURL(path.join(__resourcePath, 'static-html', 'loading.html?Download latest package from the server.'));
    try {
        var remote_version_update_link = fs.readFileSync(path.join(
            __resourcePath,
            'config',
            'download_package_link.txt'
        ));
    } catch (e) {
        //failed to read
        //default
        var remote_version_update_link = 'https://download-concatenate.deta.dev/clientResource/latest';
    };
    logger.info('Download Package from', remote_version_update_link);
    //download
    await download_file(remote_version_update_link,{
        'headers': {
            'X-Platform': process.platform.toLowerCase(),
            'X-Arch': process.arch
            //send environment information
        }
    },__update_resource_path);
    logger.info('Download Successfully');
    return;
};