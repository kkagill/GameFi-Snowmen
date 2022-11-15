import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { getChainId } from 'hardhat';
import { utils } from 'ethers';

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();
  console.log("***********************************");
  console.log("chainId:", chainId);
  console.log("***********************************");

  const result = await deploy('SnowmenToken', {
    from: deployer,
    args: [],
    log: true,
    //gasPrice: utils.parseUnits('100', 'gwei')
  });
  
  console.log("npx hardhat verify --contract contracts/SnowmenToken.sol:SnowmenToken --network mumbai " + result.address);
};

export default deploy;
deploy.tags = ['SnowmenToken'];