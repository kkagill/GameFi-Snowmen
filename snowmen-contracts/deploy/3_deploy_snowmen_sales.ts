import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { getChainId } from 'hardhat';
import { utils } from 'ethers';

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {
    deployments: { deploy, get },
    getNamedAccounts,
  } = hre;

  const { deployer } = await getNamedAccounts();

  const chainId = await getChainId();
  console.log("***********************************");
  console.log("chainId:", chainId);
  console.log("***********************************");

  const snowmenGame = (await get('SnowmenGame')).address;
  const snowmenToken = (await get('SnowmenToken')).address;

  console.log({ snowmenGame });
  console.log({ snowmenToken });

  const result = await deploy('SnowmenSales', {
    from: deployer,
    args: [snowmenGame, snowmenToken],
    log: true,
    //gasPrice: utils.parseUnits('100', 'gwei')
  });

  console.log("npx hardhat verify --constructor-args deploy_args_sales.js --network mumbai " + result.address);
};

export default deploy;
deploy.tags = ['SnowmenSales'];