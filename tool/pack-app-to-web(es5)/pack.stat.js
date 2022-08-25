
const { isMainThread, parentPort, workerData } = require('worker_threads');
const chalk = require('chalk');
let lastCpuUsage = 0;
let nextCpuTimeout = null;
let nextMemUsageTimeout = null;

function outputCPUUsage() {
    let currentCpuUsage = process.cpuUsage();
    currentCpuUsage = currentCpuUsage.user + currentCpuUsage.system;
    const cpuUsage = (currentCpuUsage - lastCpuUsage) / 1000 / 100 / 5;
    if (cpuUsage < 10)
        console.log(chalk.hex('#00ff00')('CPU usage percent: ' + (cpuUsage.toFixed(2) + '%')));
    else if (cpuUsage < 20)
        console.log(chalk.yellow('CPU usage percent: ' + (cpuUsage.toFixed(2) + '%')));
    else if (cpuUsage < 50)
        console.log(chalk.magenta('CPU usage percent: ' + (cpuUsage.toFixed(2) + '%')));
    else console.log(chalk.red('CPU usage percent: ' + (cpuUsage.toFixed(2) + '%')));
    lastCpuUsage = currentCpuUsage;
    nextCpuTimeout = setTimeout(outputCPUUsage, 5000);
};
outputCPUUsage();

function outputMemoryUsage() {
    const memoryUsage = process.memoryUsage().heapTotal + process.memoryUsage().external + process.memoryUsage().rss;
    const memoryUsageFormat = (memoryUsage < 1024 * 1024) ? (memoryUsage / 1024).toFixed(2) + 'KB'
        : (memoryUsage < 1024 * 1024 * 1024) ? (memoryUsage / 1024 / 1024).toFixed(2) + 'MB'
            : (memoryUsage / 1024 / 1024 / 1024).toFixed(2) + 'GB';
    if (memoryUsage < 1024 * 1024 * 8) console.log(chalk.hex('#00ff00')('Memory usage: ' + memoryUsageFormat));
    else if (memoryUsage < 1024 * 1024 * 32) console.log(chalk.yellow('Memory usage: ' + memoryUsageFormat));
    else if (memoryUsage < 1024 * 1024 * 512) console.log(chalk.magenta('Memory usage: ' + memoryUsageFormat));
    else console.log(chalk.red('Memory usage: ' + memoryUsageFormat));
    nextMemUsageTimeout = setTimeout(outputMemoryUsage, 5000);
};

outputMemoryUsage();

if (parentPort) parentPort.on('message', (msg) => {
    clearTimeout(nextCpuTimeout);
    clearTimeout(nextMemUsageTimeout);
});