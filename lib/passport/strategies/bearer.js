const passport = require('passport');
const { Strategy: BearerStrategy } = require('passport-http-bearer');

const db = require(`${__base}app/models`);
const { ErrResponse } = require(`${__base}lib/response`);

passport.use(new BearerStrategy({ passReqToCallback: true }, 
  async (req, accessToken, done) => {
    try {
      const token = await db.AccessToken.findOne({
        where: { 
          token: accessToken
        }
      });
      if (!token) {
        throw new ErrResponse('Token is invalid', 401);
      }
      if (token.isExpired()) {
        throw new ErrResponse('Token is expired', 401);
      }

      const user = await token.getUser();
      if(!user) {
        throw new ErrResponse('User not found', 400);
      }
  
      if(!user.isActive) {
        throw new ErrResponse('User is not active', 400);
      }
  
      req.User = user;
  
      done(null, user);
    } catch(err) {
      done(err);
    }
  }
));