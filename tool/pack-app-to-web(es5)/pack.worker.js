
const { isMainThread, parentPort, workerData } = require('worker_threads');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackPromise = (config) => {
    return new Promise((resolve, reject) => {
        webpack(config, (err, result) => {
            if (err) {
                console.error(chalk.red(err));
                reject(err);
                return;
            };
            if (result.hasErrors()) {
                console.error(chalk.red(result.compilation.errors));
                reject(err);
            };
            resolve(result);
        });
    });
};
if (isMainThread) throw new Error('This thread must be a worker.');
parentPort.on('message', async (message) => {
    try {
        const result = await webpackPromise(message);
        parentPort.postMessage('ok');
    } catch (e) {
        console.error(e);
        parentPort.postMessage(e);
    };
});