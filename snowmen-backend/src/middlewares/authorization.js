const passport = require('passport');
const CookieStrategy = require('passport-cookie');
const User = require('../models/user.model');
const { verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');

passport.use(
  'user-access-token-cookie',
  new CookieStrategy(
    {
      cookieName: 'accessToken',
      signed: true,
    },
    async (token, done) => accessTokenValidation(token, done),
  ),
);

passport.use(
  'user-refresh-token-cookie',
  new CookieStrategy(
    {
      cookieName: 'refreshToken',
      signed: true,
    },
    async (token, done) => refreshTokenValidation(token, done),
  ),
);

const accessTokenValidation = async function (accessToken, done) {
  let decoded;

  try {
    decoded = verifyAccessToken(accessToken);
  } catch {
    return done(null, false);
  }

  try {
    if (decoded) {
      const user = await User.findOne({ _id: decoded.userId });

      if (user) return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err);
  }
};

const refreshTokenValidation = async function (refreshToken, done) {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return done(null, false);
  }

  try {
    if (decoded) {
      const user = await User.findOne({ _id: decoded.userId });

      if (user?.refreshToken === refreshToken) return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err);
  }
};

exports.isUserAuthenticated = passport.authenticate(['user-access-token-cookie'], { session: false });
exports.isValidUserRefreshToken = passport.authenticate(['user-refresh-token-cookie'], { session: false });