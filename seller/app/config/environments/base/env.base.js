// module.exports = {
//     appNamespace: process.env.BASE_APP_NAMESPACE ?? 'auth',
//     servicePort: process.env.BASE_APP_PORT ?? '3008',
//     jwtSecret:process.env.AUTH_ACCESS_JWT_SECRET,
//     jwtForResetPasswordSecret:process.env.AUTH_ACCESS_JWT_SECRET_RESET_PASSWORD,
//     intraServiceApiEndpoints: {
//         nes: process.env.INTRA_SERVICE_NOTIFICAION_SERVICE_URL,
//         client: process.env.INTRA_SERVICE_SELLER_CLIENT_SERVICE_URL
//     },
//     mmi:{
//         secret:process.env.MMI_CLIENT_SECRET,
//         id:process.env.MMI_CLIENT_ID,
//         apiKey:process.env.MMI_ADVANCE_API_KEY
//     }
// };


const jwttokenkey = 'wftd3hg5$g67h*fd5h6fbvcy6rtg5wftd3hg5$g67h*fd5xxx'

module.exports = {
    appNamespace: process.env.BASE_APP_NAMESPACE ?? 'auth',
    servicePort: process.env.BASE_APP_PORT ?? '4000',
    jwtSecret:process.env.AUTH_ACCESS_JWT_SECRET || jwttokenkey,
    jwtForResetPasswordSecret:process.env.AUTH_ACCESS_JWT_SECRET_RESET_PASSWORD,
    intraServiceApiEndpoints: {
        nes: process.env.INTRA_SERVICE_NOTIFICAION_SERVICE_URL,
    },
};
