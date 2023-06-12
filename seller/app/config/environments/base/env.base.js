import path from 'path'
const nodeEnvironment = process.env.NODE_ENV || 'development';
// import baseDirpath from '../server'
const appEnvironment = process.env.APP_ENV ?? 'local';

if(appEnvironment === 'local') {
    require('dotenv').config({
        path: path.normalize(`${__dirname}/../../../../.env`),
    });
}

// var configpath = path.normalize(`${__dirname}/../../../../.env`)
// console.log(configpath);




module.exports = {
    appNamespace: process.env.BASE_APP_NAMESPACE ?? 'auth',
    servicePort: process.env.BASE_APP_PORT ,
    jwtSecret:process.env.AUTH_ACCESS_JWT_SECRET || jwttokenkey,
    jwtForResetPasswordSecret:process.env.AUTH_ACCESS_JWT_SECRET_RESET_PASSWORD,
    intraServiceApiEndpoints: {
        nes: process.env.INTRA_SERVICE_NOTIFICAION_SERVICE_URL,
        client: process.env.INTRA_SERVICE_SELLER_CLIENT_SERVICE_URL
    },
    mmi:{
        secret:process.env.MMI_CLIENT_SECRET,
        id:process.env.MMI_CLIENT_ID,
        apiKey:process.env.MMI_ADVANCE_API_KEY
    }
};