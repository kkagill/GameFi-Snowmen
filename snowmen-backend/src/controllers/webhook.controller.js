const ethers = require('ethers');
const httpStatus = require('http-status');
const { rewardService, blockchainService, webhookService } = require('../services');

const getWebhooks = async (_, res) => {
  const webhooks = await webhookService.getAllWebhooks();
  res.status(httpStatus.OK).send({ webhooks });
};

const sendRandomReward = async (req, res) => {
  const webhookData = req.body;
  const EVENT_ID = '1020847100762815390390123822295304634368';

  // const webhookData = {
  //   confirmed: false,
  //   chainId: '0x13881',
  //   abi: [
  //     {
  //       anonymous: false,
  //       inputs: [Array],
  //       name: 'BuyItem',
  //       type: 'event'
  //     }
  //   ],
  //   streamId: 'c1316461-b534-4f9b-a8f2-b8106d491b18',
  //   tag: 'Special Event',
  //   retries: 0,
  //   block: {
  //     number: '29172804',
  //     hash: '0x18afe40bc14f5f106d5769beda11ebfd492b5142166783c893f518cb3b0ed11f',
  //     timestamp: '1668553393'
  //   },
  //   logs: [
  //     {
  //       logIndex: '58',
  //       transactionHash: '0xbbd3dfabb9e61a847ed645ee7921d9293bc472a87d21e8e54ea258a910f98412',
  //       address: '0x6b3cfcf5fbf6d9aced6051a40424ec78a0c56b1c',
  //       data: '0x0000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000ebec21ee1da400000000000000000000000000000000000000000000000000000000000063741ab1',
  //       topic0: '0x75b2e59e11f908cb424d07858db7152a4b973814354a5bfe043dda59966d9bed', // buyItem 이벤트 자체의 hash
  //       topic1: '0x000000000000000000000000cbefd3f11c200ced40f1dbf91e36d51de7503c82', // indexed된 buyer address 
  //       topic2: null,
  //       topic3: null
  //     }
  //   ],
  //   txs: [
  //     {
  //       hash: '0xbbd3dfabb9e61a847ed645ee7921d9293bc472a87d21e8e54ea258a910f98412',
  //       gas: '78412',
  //       gasPrice: '1500000008',
  //       nonce: '90',
  //       input: '0x9979c0090000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000000000000000000000ebec21ee1da40000',
  //       transactionIndex: '12',
  //       fromAddress: '0xcbefd3f11c200ced40f1dbf91e36d51de7503c82',
  //       toAddress: '0x6b3cfcf5fbf6d9aced6051a40424ec78a0c56b1c',
  //       value: '0',
  //       type: '2',
  //       v: '1',
  //       r: '59377907657988577724105619685146620677437641100146891844400210455719243656217',
  //       s: '25418301922426254189751866182712781324005522941338715956911602963757577150685',
  //       receiptCumulativeGasUsed: '3494333',
  //       receiptGasUsed: '73612',
  //       receiptContractAddress: null,
  //       receiptRoot: null,
  //       receiptStatus: '1'
  //     }
  //   ],
  //   txsInternal: [],
  //   erc20Transfers: [],
  //   erc20Approvals: [],
  //   nftApprovals: { ERC1155: [], ERC721: [] },
  //   nftTransfers: []
  // };

  const logs = webhookData?.logs;
  
  if (logs?.length > 0) {
    try {
      const { streamId, tag } = webhookData;
      const { transactionHash } = logs[0];
      console.log({transactionHash})
      const webhook = await webhookService.getWebhookByTxHash(transactionHash);

      if (!webhook) {
        const result = await webhookService.createWebhook(streamId, tag, transactionHash);

        if (result) {
          const decoded = ethers.utils.defaultAbiCoder.decode(
            ['uint256', 'uint256', 'uint256'], // address buyer는 빠져있다. indexed된애들은 data에 포함되어있지않고 topic에 있음
            logs[0].data
          );
          const topic1 = logs[0]?.topic1;
          const addressDecoded = ethers.utils.defaultAbiCoder.decode(['address'], topic1);
          const address = addressDecoded[0];
          const tokenId = decoded[0].toString();

          if (tokenId === EVENT_ID) {
            const randomNumber = Math.floor((Math.random() * 50) + 10);
            console.log({ randomNumber })
            const reward = await rewardService.createReward(address, randomNumber);

            if (reward) {
              const receipt = await blockchainService.sendSnowmenToken(address, randomNumber);

              if (receipt.status === 1) {
                const { _id: rewardId } = reward;
                await rewardService.updateTxHash(rewardId, receipt.transactionHash);
                console.log(receipt.transactionHash)
                return res.status(httpStatus.OK).send();
              }

              return res.status(httpStatus.NOT_FOUND).send({ error: 'No receipt found' });
            }
          }

          return res.status(httpStatus.NOT_FOUND).send({ error: 'Incorrect tokenId' });
        }

        return res.status(httpStatus.NOT_FOUND).send({ error: 'No Logs' });
      }
    } catch (err) {
      console.log(err)
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
    }
  }

  return res.status(httpStatus.OK).send();
  //return res.status(httpStatus.NOT_FOUND).send({ error: 'No Logs' });
};

module.exports = {
  getWebhooks,
  sendRandomReward,
};