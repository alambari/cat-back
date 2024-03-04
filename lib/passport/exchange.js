'use strict';

const oauth2orize = require('oauth2orize');

const db = require(`${__base}app/models`);
const { ErrResponse } = require(`${__base}lib/response`);

// const logger = require(`${__base}lib/winston`);
// const log = logger(process.env.NODE_ENV || 'development');

const oauth2 = oauth2orize.createServer();

oauth2.exchange(
  oauth2orize.exchange.password(async (client, username, password, done) => {
    try {
      const user = await db.User.findOne({
        where: {
          username
        }
      });

      if(!user) {
        throw new ErrResponse('User not found', 401);
      }

      if(!user.isActive) {
        throw new ErrResponse('User not active', 401);
      }

      if(!user.passValidate(password)) {
        throw new ErrResponse('User invalid password', 401);
      }

      const accessToken = await db.AccessToken.findCreateOrUpdateToken(user);
      done(null, accessToken.token, null, {
        expires_in: accessToken.expiresIn(),
        expired_at: accessToken.expiredAt,
        user: {
          username: user.username,
          phone: user.phone,
          email: user.email,
        }
      });
    } catch(err) {
      done(err);
    }
  })
);

module.exports = oauth2;
