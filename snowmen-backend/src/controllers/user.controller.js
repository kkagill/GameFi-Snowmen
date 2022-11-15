const httpStatus = require('http-status');
const { userService } = require('../services');
const {
  createAccessToken,
  createRefreshToken,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require('../utils/jwt');

const login = async (req, res) => {
  const { account } = req.body;

  let user = await userService.getUserByAccount(account);

  if (!user) {
    user = await userService.createUser(account);
  }

  res.status(httpStatus.OK).send({ nonce: user.nonce });
};

const verifySignature = async (req, res) => {
  const { account, signature } = req.body;

  const user = await userService.getUserByAccount(account);

  const { _id: userId, nonce } = user;

  if (user) {
    try {
      const isVerified = await userService.verify({ account, signature, nonce });

      if (isVerified) {
        await userService.updateNonce(userId);

        const accessToken = createAccessToken(userId, { account: user?.account });
        const refreshToken = createRefreshToken(userId);

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        await userService.updateRefreshToken(userId, refreshToken);

        return res.status(httpStatus.OK).send({ accessToken });
      }
      return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Signature verification failed' });
    } catch (err) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
    }
  }

  return res.status(httpStatus.NOT_FOUND).send({ error: 'User not found' });
};

const logout = async (_, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).send();
};

const getUsers = async (_, res) => {
  const users = await userService.getAllUsers();
  res.status(httpStatus.OK).send({ users });
};

module.exports = {
  login,
  verifySignature,
  logout,
  getUsers,
};
