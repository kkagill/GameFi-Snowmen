const { User } = require('../models');
const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

const createUser = async (account) => {
  const user = new User({
    account,
    nonce: Math.floor(Math.random() * 10000),
  });
  return user.save({ user });
}

const getAllUsers = async () => {
  return User.find({});
}

const getUserByAccount = async (account) => {
  return User.findOne({ account });
}

const updateNonce = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.nonce = Math.floor(Math.random() * 10000);
    await user.save();
  }
}

const updateRefreshToken = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = refreshToken;
    await user.save();
  }
}

const createMsg = (nonce) => `
  Welcome to Snowmen!
  
  Approve this message to securely log in.
  
  Nonce:
  ${JSON.stringify(nonce)}`;

const verify = async ({ account, signature, nonce }) => {
  const msg = createMsg(nonce);

  // We now are in possession of msg, account and signature. We
  // will use a helper from eth-sig-util to extract the address from the signature
  const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
  const address = sigUtil.recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  // The signature verification is successful if the address found with
  // sigUtil.recoverPersonalSignature matches the initial account
  if (address.toLowerCase() === account.toLowerCase()) {
    return true;
  }

  return false;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByAccount,
  updateNonce,
  updateRefreshToken,
  verify,
};
