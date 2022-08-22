
const fs = require('fs/promises');
const webpack = require('webpack');
const path = require('path');
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
const chalk = require('chalk');
const no_pack_dir = ['node_modules', 'locales', 'css', 'backend', 'sql', 'fonts', '.html', '.png', '.jpg', 'localforage.js', 'dataurl2blob.js', 'vconsole.js', 'vue.js', 'image-conversion.js', '.md', 'require.js'];

((async () => {

    const pack = (source_path, target_path) => {
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
                for (var i = 0, len = dirFiles.length; i < len; i++) {
                    const file = dirFiles[i];
                    await pack_dir(
                        path.join(source_path, '/', file),
                        path.join(target_path, '/', file),
                        !isNoPack);
                };
                isPack && console.timeEnd(chalk.green('Packing directory', source_path));
                !isPack && console.timeEnd(chalk.yellow('Copying directory', target_path));
            } else {
                pack_file(source_path, target_path, isPack);
            };

        };

        const pack_file = async (source_path, target_path, isPack) => {
            isPack && console.time(chalk.green('Packing file', source_path));
            !isPack && console.time(chalk.green('Copying file', source_path));

            const fileContent = (await fs.readFile(source_path, 'binary')).toString();

            const tmpSourceFilename = Math.random().toString(36).substring(2);
            const tmpTargetFilename = Math.random().toString(36).substring(2);

            if (isPack) {
                //paste to tmp directory
                await fs.writeFile('./tmp/src/' + tmpSourceFilename + '.js', '/* For debug: location: ' + source_path + ' */' + fileContent, 'binary');
                const target = (source_path.includes('require.js') ? ('web') : ((fileContent.includes('module.exports')) ? (
                    'node'
                ) : (
                    'web'
                )));
                try {
                    await webpackPromise({
                        entry: './tmp/src/' + tmpSourceFilename + '.js',
                        output: {
                            path: path.join(__dirname, 'tmp/dist'),
                            filename: tmpTargetFilename + '.js',
                            ...((target === 'node')?{
                                libraryTarget: 'umd'
                            }:{
                                libraryTarget: 'window'
                            })
                        },
                        mode: 'production',
                        target: [target, 'es5'],
                        module: {
                            rules: [
                                {
                                    test: /(\.html|\.js)$/,
                                    use: {
                                        loader: 'babel-loader',
                                        options: {
                                            presets: [
                                                [
                                                    '@babel/preset-env', {
                                                        // useBuiltIns: 'usage'
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
                const packFileContent = await fs.readFile('./tmp/dist/' + tmpTargetFilename + '.js', 'binary');
                await fs.writeFile(target_path, '/* Webpack & Concatenate browser pack tool\n * Source Path:' + source_path + '\n * Target: ' + target + ' */\n' + packFileContent, 'binary');
            } else {
                if (target_path.includes('.js')) await fs.writeFile(target_path, '/* Concatenate browser pack tool: This file is not compressed and converted into es5 */\n' + fileContent, 'binary');
                else if (target_path.includes('.html')) await fs.writeFile(target_path, '<!-- Concatenate browser pack tool: This file is not compressed and converted into es5 -->\n' + fileContent, 'binary');
                else await fs.writeFile(target_path, fileContent, 'binary');
            };

            isPack && console.timeEnd(chalk.green('Packing file', source_path));
            !isPack && console.timeEnd(chalk.green('Copying file', source_path));
        };

        pack_dir(source_path, target_path);
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

    try {
        await fs.rmdir('./tmp');
    } catch (e) { };
})());