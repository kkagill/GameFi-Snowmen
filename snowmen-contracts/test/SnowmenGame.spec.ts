// const { expect } = require('chai');
// const { ethers } = require('hardhat');

// describe('Test contract', function () {
//   let SnowmenGame;
//   let owner;
//   let buyer1;
//   let buyer2;
//   let attacker;
//   let corporateWallet;

//   beforeEach(async function () {
//     [owner, buyer1, buyer2, attacker, corporateWallet] = await ethers.getSigners();

//     SnowmenGame = await ethers.getContractFactory('SnowmenGame');
//     SnowmenGame = await SnowmenGame.deploy();
//   });

//   describe('Deployment', function () {
//     it('gets Ids', async function () {  

//         const ids = await SnowmenGame.getIds(5000);
//         for (let i = 0; i < ids.length; i++) {
//           console.log(ids[i] + " / " + i);
//         }       
//     });
//   });
// });