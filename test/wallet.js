const { assert } = require("console");
const { expectRevert } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
    let wallet;

    beforeEach(async () => {
        wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);

        await web3.eth.sendTransaction({
            from: accounts[3],
            to: wallet.address,
            value: 1000
        });
    });

    /*it('Should have correct approvers and quorum', async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
    
        assert(approvers.length == 3);
        assert(approvers[0] == accounts[0]);
        assert(approvers[1] == accounts[1]);
        assert(approvers[2] == accounts[2]);
        assert(quorum.toNumber() == 2);
    });

    it('Should create transfers', async () => {
        await wallet.createTransfer(accounts[5], 100, {from: accounts[1]});
        const transfers = await wallet.getTransfers();
        
        // numbers inside a (truffle test?) are not BN objects, but strings
        assert(transfers[0].to == accounts[5]);
        assert(transfers[0].amount == "100");
        assert(transfers[0].id == "0");
        assert(transfers[0].approvals == "0");
        assert(transfers[0].sent == false);
    });
    
    it('Should not create a transfer', async () => {
        await expectRevert(
            wallet.createTransfer(accounts[6], 100, {from: accounts[4]}),
            "You are not allowed to approve"
        );
    });

    it('Should approve a transfer', async () => {
        await wallet.createTransfer(accounts[5], 100, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});
        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        
        assert(transfers.length == 1);
        assert(transfers[0].approvals == "1");  // main test here
        assert(transfers[0].sent == false);
        assert(balance == '1000');
    });*/

    it('Should send transfer after 3 approvals', async () => {
        const balBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
        await wallet.createTransfer(accounts[5], 100, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[1]});
        await wallet.approveTransfer(0, {from: accounts[2]});
        const balAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        const balance5 = await web3.eth.getBalance(accounts[5]);
        balance_t = web3.utils.toWei('100') + web3.utils.toWei('100', "wei");
        balance_t = web3.utils.toBN(balance_t);

        assert(transfers.length == 1);
        assert(transfers[0].approvals == "2");
        assert(transfers[0].sent == true);
        assert(balance == '900');
        assert(balAfter.sub(balBefore) == 100);
        // assert(web3.utils.toBN(balance5).sub(balance_t) == 0);
    })
    
    it('Should not approve a transfer', async () => {
        await wallet.createTransfer(accounts[5], 100, {from: accounts[1]});
        await expectRevert(
            wallet.approveTransfer(0, {from: accounts[4]}),
            "You are not allowed to approve"
        );
        const transfers = await wallet.getTransfers();
        const balance = await web3.eth.getBalance(wallet.address);
        
        assert(transfers.length == 1);
        assert(transfers[0].approvals == "0");  // main test here
        assert(transfers[0].sent == false);
        assert(balance == '1000');
    });
});