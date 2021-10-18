// We import Chai to use its asserting functions here.
const { expect } = require('chai');

const timeForward = async (hours) => {
  await ethers.provider.send('evm_increaseTime', [3600 * hours]);
  await ethers.provider.send('evm_mine');
};

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe('DevToken contract', function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory('DevToken');
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    hardhatToken = await Token.deploy(
      'DevToken',
      'DVTK',
      18,
      '50000000000000000000000'
    );
  });

  // You can nest describe calls to create subsections.
  describe('Deployment', function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it('Should set the right owner', async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it('Should assign the total supply of tokens to the owner', async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Supply', function () {
    it('Should return token total supply', async function () {
      // call our totalSUpply function
      const supply = await hardhatToken.totalSupply();
      expect(supply.toString()).to.equal('50000000000000000000000');
    });
  });

  describe('Transfer', function () {
    it('Should transfer tokens between accounts', async function () {
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it('Should fail if sender doesn’t have enough tokens', async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.revertedWith('DevToken: cant transfer more than your account holds');

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it('Should update balances after transfers', async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await hardhatToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await hardhatToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe('Minting', function () {
    it('Should not mint with address 0', async function () {
      await expect(
        hardhatToken.mint('0x0000000000000000000000000000000000000000', 100)
      ).to.revertedWith('DevToken: cannot mint to zero address');
    });
    it('Should mint tokens', async function () {
      const mintTokens = 100;
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(0);
      // Let's mint 100 tokens to the user and grab the balance again
      const totalSupply = await hardhatToken.totalSupply();
      await hardhatToken.mint(addr1.address, mintTokens);
      // Grab the balance again to see what it is after calling mint
      const afterBalance = await hardhatToken.balanceOf(addr1.address);
      const afterSupply = await hardhatToken.totalSupply();
      expect(afterBalance).to.equal(mintTokens);
      expect(afterSupply).to.equal(totalSupply.add(mintTokens));
    });
  });

  describe('Burning', function () {
    it('Should not mint with address 0', async function () {
      await expect(
        hardhatToken.burn('0x0000000000000000000000000000000000000000', 100)
      ).to.revertedWith('DevToken: cannot burn from zero address');
    });
    it('Should burn tokens', async function () {
      const burnTokens = 100;
      await hardhatToken.transfer(addr1.address, burnTokens);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(burnTokens);

      await expect(
        hardhatToken.burn(addr1.address, addr1Balance.add(burnTokens))
      ).to.revertedWith('DevToken: Cannot burn more than the account owns');

      // Let's burn 100 tokens
      const totalSupply = await hardhatToken.totalSupply();
      hardhatToken.burn(addr1.address, burnTokens);
      const afterBalance = await hardhatToken.balanceOf(addr1.address);
      const afterSupply = await hardhatToken.totalSupply();
      expect(afterBalance).to.equal(addr1Balance.sub(burnTokens));
      expect(afterSupply).to.equal(totalSupply.sub(burnTokens));
    });
  });

  describe('Ownable', function () {
    it('Should transfer ownership', async function () {
      const initialOwner = await hardhatToken.owner();
      expect(initialOwner).to.equal(owner.address);

      await hardhatToken.transferOwnership(addr1.address);
      expect(await hardhatToken.owner()).to.equal(addr1.address);
    });
    it('Should renounce ownership', async function () {
      await hardhatToken.renounceOwnership();
      expect(await hardhatToken.owner()).to.equal(
        '0x0000000000000000000000000000000000000000'
      );
    });
    it('Should allow onlyOwner', async function () {
      await expect(
        hardhatToken.connect(addr1).transferOwnership(addr2.address)
      ).to.revertedWith('Ownable: only owner can call this function');
    });
  });

  describe('Allowance', function () {
    it('Should not approve to address 0', async function () {
      await expect(
        hardhatToken.approve('0x0000000000000000000000000000000000000000', 100)
      ).to.revertedWith('DevToken: approve cannot be to zero address');
    });
    it('Should allow account some allowance', async function () {
      hardhatToken.approve(addr1.address, 100);
      // Verify by checking allowance
      let allowance = await hardhatToken.allowance(
        owner.address,
        addr1.address
      );
      expect(allowance).to.equal(100);
    });
    it('Should transfer with allowance', async function () {
      hardhatToken.approve(addr1.address, 100);
      await expect(
        hardhatToken
          .connect(addr1)
          .transferFrom(owner.address, addr2.address, 200)
      ).to.revertedWith('DevToken: You cannot spend that much on this account');
      await hardhatToken
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, 60);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(60);
      allowance = await hardhatToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(40);
    });
  });

  describe('Staking', function () {
    it('Should not stake more than own', async function () {
      await expect(hardhatToken.connect(addr2).stake(1000)).to.revertedWith(
        'DevToken: Cannot stake more than you own'
      );
    });
    it('Should stake and emit event', async function () {
      const stakeTokens = 1000;
      await hardhatToken.mint(addr1.address, stakeTokens);
      // Grab the balance again to see what it is after calling mint
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(stakeTokens);
      const time = Date.now();
      await ethers.provider.send('evm_setNextBlockTimestamp', [time]);
      await ethers.provider.send('evm_mine');
      // stake 2 times
      await expect(hardhatToken.stake(stakeTokens))
        .to.emit(hardhatToken, 'Staked')
        .withArgs(owner.address, stakeTokens, 1, time + 1);
      await expect(hardhatToken.connect(addr1).stake(stakeTokens))
        .to.emit(hardhatToken, 'Staked')
        .withArgs(addr1.address, stakeTokens, 2, time + 2);
    });
    it('Should not withdraw more then current own stake', async function () {
      hardhatToken.stake(100);
      await expect(hardhatToken.withdrawStake(200, 0)).to.revertedWith(
        'Staking: Cannot withdraw more than you have staked'
      );
    });
    it('Should withdraw 50 tokens from a stake', async function () {
      let stakeTokens = 200;
      const withdrawTokens = 50;
      hardhatToken.stake(stakeTokens);
      hardhatToken.withdrawStake(withdrawTokens, 0);
      const summary = await hardhatToken.hasStake(owner.address);
      expect(summary.total_amount).to.equal(stakeTokens - withdrawTokens);
      // Itterate all stakes and verify their amount aswell.
      stakeAmount = summary.stakes[0].amount;
      expect(stakeAmount).to.equal(stakeTokens - withdrawTokens);
    });
    it('Should remove stake if empty', async function () {
      hardhatToken.stake(100);
      hardhatToken.withdrawStake(100, 0);
      const summary = await hardhatToken.hasStake(owner.address);
      expect(summary.stakes[0].user).to.equal(
        '0x0000000000000000000000000000000000000000'
      );
    });
    it('Should calculate proper rewards', async function () {
      let stakeTokens = 100;
      hardhatToken.stake(stakeTokens);
      let summary = await hardhatToken.hasStake(owner.address);
      await timeForward(20);
      summary = await hardhatToken.hasStake(owner.address);
      expect(summary.stakes[0].claimable).to.equal(stakeTokens * 0.02);
      const newStakeTokens = 1000;
      hardhatToken.stake(newStakeTokens);
      summary = await hardhatToken.hasStake(owner.address);
      await timeForward(20);
      summary = await hardhatToken.hasStake(owner.address);
      // Make sure total stake reward is 24 (20+4)
      // The first 100 has been staked for 40 hours now, so its 4 in rewards.
      expect(summary.stakes[0].claimable).to.equal(stakeTokens * 0.04);
      expect(summary.stakes[1].claimable).to.equal(newStakeTokens * 0.02);
    });
    it('Should reward stakes', async function () {
      // use fresh account
      const staker = addr2.address;
      hardhatToken.mint(staker, 1000);
      const initialBalance = await hardhatToken.balanceOf(staker);
      expect(initialBalance).to.equal(1000);
      await hardhatToken.connect(addr2).stake(200);
      let summary = await hardhatToken.hasStake(staker);
      await timeForward(20);
      summary = await hardhatToken.hasStake(staker);
      let stake = summary.stakes[0];
      await hardhatToken.connect(addr2).withdrawStake(100, 0);
      // Balance of account holder should be updated by 104 tokens
      const afterBalance = await hardhatToken.balanceOf(staker);
      const expected = stake.claimable.add(1000 - 200 + 100);
      expect(afterBalance).to.equal(expected);
      // Claiming again should not return any rewards since we reset timer
      await hardhatToken.connect(addr2).withdrawStake(100, 0);
      const secondBalance = await hardhatToken.balanceOf(staker);
      expect(secondBalance).to.equal(afterBalance.add(100));
    });
  });
});
