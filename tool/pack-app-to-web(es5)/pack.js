
const fs = require('fs/promises');
const { existsSync } = require('fs');
const path = require('path');
const chalk = require('chalk');
const no_pack_dir = ['node_modules', 'locales', 'css', 'backend', 'sql', 'fonts', '.html', '.png', '.jpg', 'localforage.js', 'dataurl2blob.js', 'vconsole.js', 'vue.js', 'image-conversion.js', '.md', 'require.js'];

let maxWorkerThreads = -1;
for (let i = 0, len = process.argv.length; i < len; i++) {
    if (process.argv[i].indexOf('--max-workers') !== -1) {
        maxWorkerThreads = ~~process.argv[i].split('=')[1];
    };
};
if (maxWorkerThreads === -1 || maxWorkerThreads === 0) maxWorkerThreads = require('os').cpus().length; //cpu cores

const { Worker } = require('worker_threads');
const workers = new Array(maxWorkerThreads).fill(new Worker(path.join(__dirname, 'pack.worker.js')));
const stat = new Worker(path.join(__dirname, 'pack.stat.js'));
const workers_descriptor = new Array(maxWorkerThreads).fill(false);

const workerPromise = async (config) => {
    return new Promise(async (resolve, reject) => {

        let useThreadID = -1;
        do {
            for (let i = 0; i < workers_descriptor.length; i++) {
                if (workers_descriptor[i] === false) {
                    useThreadID = i;
                    workers_descriptor[i] = true;
                    break;
                };
            };
            if (useThreadID === -1) await delay(maxWorkerThreads * 1000 * 2);
        } while (useThreadID === -1);

        const worker = workers[useThreadID];
        worker.postMessage(config);

        worker.once('message', async (result) => {
            if (result instanceof Error) return reject(result);
            workers_descriptor[useThreadID] = false;
            let isFileExists = null;
            do {
                isFileExists = existsSync(path.join(config.output.path, config.output.filename));
                if (!isFileExists) await delay(maxWorkerThreads * 200);
            } while (!isFileExists);
            return resolve(result);
            
        });
    });
};

const delay = (t) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(t);
        }, t);
    });
};

((async () => {

    console.log(chalk.hex('#00ff00')('Max worker threads:',maxWorkerThreads));

    const pack = async (source_path, target_path) => {
        const match_dir = (path) => {
            let isMatch = false;
            no_pack_dir.forEach((value) => {
                if (path.includes(value)) {
                    isMatch = true;
                    return;
                };
            });
            return isMatch;
        };

        const pack_dir = async (source_path, target_path, isPack = true) => {

            const isNoPack = match_dir(source_path);

            if (isNoPack && isPack) return pack_dir(source_path, target_path, false);

            const isDir = (await fs.stat(source_path)).isDirectory();

            if (isDir) {
                try {
                    await fs.mkdir(target_path);
                } catch (e) { };
                isPack && console.time(chalk.green('Packing directory', source_path));
                !isPack && console.time(chalk.yellow('Copying directory', target_path));
                const dirFiles = await fs.readdir(source_path);
                const promises = [];
                for (var i = 0, len = dirFiles.length; i < len; i++) {
                    const file = dirFiles[i];
                    promises.push(pack_dir(
                        path.join(source_path, '/', file),
                        path.join(target_path, '/', file),
                        !isNoPack));
                };
                await Promise.all(promises);
                isPack && console.timeEnd(chalk.green('Packing directory', source_path));
                !isPack && console.timeEnd(chalk.yellow('Copying directory', target_path));
            } else {
                await pack_file(source_path, target_path, isPack);
            };

        };

        const pack_file = async (source_path, target_path, isPack) => {
            isPack && console.time(chalk.green('Packing file', source_path));
            !isPack && console.time(chalk.green('Copying file', source_path));

            const fileContent = (await fs.readFile(source_path, 'binary')).toString();

            const tmpFilename = Math.random().toString(36).substring(2);

            if (isPack) {
                //paste to tmp directory
                await fs.writeFile('./tmp/src/' + tmpFilename + '.js', '/* For debug: location: ' + source_path + ' */' + fileContent, 'binary');
                const target = (source_path.includes('require.js') ? ('web') : ((fileContent.includes('module.exports')) ? (
                    'node'
                ) : (
                    'web'
                )));
                const isArgvContains = (str) => process.argv.indexOf(str) !== -1;
                const isProductionMode = !isArgvContains('--debug');
                const supportBrowser = (isArgvContains('--2000') || isArgvContains('--ie5')) ? ({
                    ie: 5
                }) : (
                    (isArgvContains('--es3') ? ({
                        chrome: 4,
                        edge: 12,
                        safari: 3.1,
                        firefox: 2,
                        opera: 10,
                        ie: 6
                    }) : ((isArgvContains('--es5') ? ({
                        chrome: 23,
                        edge: 12,
                        safari: 6,
                        firefox: 21,
                        opera: 15,
                        ie: 10
                    }) : (
                        (isArgvContains('--ie11') ? ({
                            ie: 11
                        }) : (
                            {
                                //es6
                                chrome: 51,
                                edge: 15,
                                safari: 10,
                                firefox: 54,
                                opera: 38
                            }
                        ))
                    ))))
                );
                const isNoBabel = isArgvContains('--no-convert');
                try {
                    await workerPromise({
                        entry: './tmp/src/' + tmpFilename + '.js',
                        output: {
                            path: path.join(__dirname, 'tmp/dist'),
                            filename: tmpFilename + '.js',
                            libraryTarget: target === 'node' ? 'umd' : 'window'
                        },
                        mode: isProductionMode ? 'production' : 'development',
                        target: [target, 'es5'],
                        ...(isProductionMode ? {
                        } : {
                            devtool: 'inline-source-map'
                        }
                        ),
                        module: {
                            rules: [
                                isNoBabel?({}):{
                                    test: /(\.html|\.js)$/,
                                    use: {
                                        loader: 'babel-loader',
                                        options: {
                                            presets: [
                                                [
                                                    '@babel/preset-env', {
                                                        useBuiltIns: 'usage',
                                                        corejs: 2,
                                                        targets: supportBrowser
                                                    },
                                                ],

                                            ],
                                        },
                                    },
                                },
                            ],
                        },
                    });
                } catch (e) {
                    console.error(chalk.red('Webpack throw an error\nFile:' + source_path));
                    process.exit(1);
                };
                const packFileContent = await fs.readFile('./tmp/dist/' + tmpFilename + '.js', 'binary');
                await fs.writeFile(target_path, '/* Webpack & Concatenate browser pack tool\n * Source Path:' + source_path + '\n * Target: ' + target + '\n * Mode: ' + (isProductionMode ? 'production' : 'development') + '*/\n' + packFileContent, 'binary');
            } else {
                if (target_path.includes('.js')) await fs.writeFile(target_path, '/* Concatenate browser pack tool: This file is not compressed and converted into es5 */\n' + fileContent, 'binary');
                else if (target_path.includes('.html')) await fs.writeFile(target_path, '<!-- Concatenate browser pack tool: This file is not compressed and converted into es5 -->\n' + fileContent, 'binary');
                else await fs.writeFile(target_path, fileContent, 'binary');
            };

            isPack && console.timeEnd(chalk.green('Packing file', source_path));
            !isPack && console.timeEnd(chalk.green('Copying file', source_path));
        };

        await pack_dir(source_path, target_path);
    };

    try {
        await fs.mkdir('./resource-web');
    } catch (e) { };

    try {
        await fs.mkdir('./tmp');
        await fs.mkdir('./tmp/src');
        await fs.mkdir('./tmp/dist');
    } catch (e) { };

    await pack('./resource-app', './resource-web');

    stat.postMessage('end');

    try {
        await fs.rmdir('./tmp');
    } catch (e) { };

    process.exit(0);
})());