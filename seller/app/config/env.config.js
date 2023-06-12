import path from 'path'
const nodeEnvironment = process.env.NODE_ENV || 'development';
// import baseDirpath from '../server'
const appEnvironment = process.env.APP_ENV ?? 'local';

// global.__basedir = __dirname;
// var configpath = path.normalize(`${__dirname}/../server.js`)
// console.log(configpath);

if(appEnvironment === 'local') {
    require('dotenv').config({
        path: path.normalize(`${__dirname}/../../.env`),
    });
}


const projectBaseDirectory = path.normalize(`${__dirname}/../../`);


import environmentConfig from './environments/base';

const mergedEnvironmentConfig = {
    ...environmentConfig,
    nodeEnvironment,
    appEnvironment,
    projectBaseDirectory,
};
Object.freeze(mergedEnvironmentConfig);
const _mergedEnvironmentConfig = mergedEnvironmentConfig;
export { _mergedEnvironmentConfig as mergedEnvironmentConfig };
