const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_MUMBAI);
const SNOWMEN_TOKEN_ABI = require('../abi/SnowmenToken.abi');
const SNOWMEN_TOKEN_ADDRESS = '0x6048443220Af57898B65d5A5f3d63D01CC76D70d';

const sendSnowmenToken = async (receiver, score) => {
  const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
  const signer = wallet.connect(provider);
  const contract = new ethers.Contract(SNOWMEN_TOKEN_ADDRESS, SNOWMEN_TOKEN_ABI, signer);
  //const amountInWei = ethers.utils.parseUnits(score.toString(), "ether");
  const amountInWei = ethers.utils.parseUnits(score.toString(), 18)
  const data = await contract.populateTransaction.transfer(receiver, amountInWei);
  const tx = await signer.sendTransaction(data);
  const receipt = await tx.wait();
  
  return receipt;
};

module.exports = {
  sendSnowmenToken,
};
