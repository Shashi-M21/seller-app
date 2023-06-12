import passportJWT from 'passport-jwt';
import { UnauthenticatedError } from '../../errors';
import MESSAGES from '../../utils/messages';
// import { UnauthenticatedError } from '../../errors';
// import MESSAGES from '../../../utils/messages';
// import logger from '../../logger';
import { HEADERS } from '../../utils/constants';
import {mergedEnvironmentConfig} from '../../../config/env.config';
const JwtStrategy = passportJWT.Strategy;
const jwttokenkey = 'wftd3hg5$g67h*fd5h6fbvcy6rtg5wftd3hg5$g67h*fd5xxx'

const tokenExtractor = function (req) {
    let token = null;
    let tokenArray = [];

    if (req) {
        token = req.get(HEADERS.ACCESS_TOKEN);

        if (!token) {
            throw new UnauthenticatedError(
                MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID
            );
        }

        tokenArray = token.split(' ');
    }

    console.log("token--------->",tokenArray);
    return tokenArray[1];
};

const opts = {
    jwtFromRequest: tokenExtractor, //ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: mergedEnvironmentConfig.jwtSecret || jwttokenkey,
    passReqToCallback: true,
};

const passportJwtStrategy = new JwtStrategy(
    opts,
    async (req, jwtPayload, done) => {
        try {
            let user = {};

            // if jwt payload contains user obj then its an inter service communication call
            if (jwtPayload.user) {
                user = jwtPayload.user;
            } else if (jwtPayload.userId) {

                if (!user) {
                    throw new UnauthenticatedError(
                        MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID
                    );
                } else if (user.enabled === false) {
                    throw new UnauthenticatedError(
                        MESSAGES.LOGIN_ERROR_USER_ACCOUNT_DEACTIVATED
                    );
                }

                user = user.toJSON();
            }
            return done(null, user);
        } catch (err) {
            // logger.log('error', err);
            return done(err, null);
        }
    }
);

export default passportJwtStrategy;
