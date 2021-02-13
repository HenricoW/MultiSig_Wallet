import React, { useEffect, useState } from 'react';
import Header from './Header';
import NewTransfer from './NewTransfer';
import TransferList from './TransferList';
import { web3obj, walletObj } from './utils';

function App () {
  const [web3, setWeb3] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);
  const [currAccount, setCurrAccount] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const _web3 = await web3obj();
      const _wallet = await walletObj(_web3);
      const _accounts = await _web3.eth.getAccounts();
      const _approvers = await _wallet.methods.getApprovers().call();
      const _quorum = await _wallet.methods.quorum().call();
      // await fetchTransfers();                                                  // look into how to implement this!!
      const _transfers = await _wallet.methods.getTransfers().call();

      setWeb3(_web3);
      setWallet(_wallet);
      setAccounts(_accounts);
      setApprovers(_approvers);
      setQuorum(_quorum);
      setTransfers(_transfers);
    }

    init();
  }, []);

  const getAccount = async () => {
    const acc = await window.ethereum.request({method: 'eth_requestAccounts'});
    let _acc = acc[0];
    setCurrAccount(_acc);
  }
  getAccount();

  window.ethereum.on('accountsChanged', accs => {
    setCurrAccount(accs[0]);
  });

  const fetchTransfers = async () => {
    const _trfs = await wallet.methods.getTransfers().call();
    setTransfers(_trfs);
  }
  
  const sendTransfer = async transfer => {
    getAccount();
    console.log(currAccount);
    wallet.methods.createTransfer(transfer.to, transfer.amount)
    .send({from: currAccount, gas: '300000'})
    .then(async receipt => {
      console.log(receipt);
      await fetchTransfers();
    });
  }
  
  const approveTransfer = async transferId => {
    await getAccount();
    console.log('acc change ready!');
    const hasAppr = await wallet.methods.apprRecord(currAccount, transferId).call();
    if(hasAppr){
      window.alert("You have already approved this transaction");
    }
    else {
      try {
        wallet.methods.approveTransfer(transferId)
        .send({from: currAccount, gas: '300000'})
        .then(async receipt => {
          console.log(receipt);
          await fetchTransfers();
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  
  if(
    typeof web3 === 'undefined' ||
    typeof wallet === 'undefined'||
    typeof accounts === 'undefined' ||
    approvers === [] ||
    quorum === 'undefined'
  ){
    return <h3>Loading......</h3>
  }
  
  return (
    <div className="App">
      <h1>Multisig</h1>
      <Header approvers={approvers} quorum={quorum} />
      <br></br>
      <NewTransfer sendTransfer={sendTransfer} />
      <br></br>
      <br></br>
      <TransferList transfers={transfers} approveTransfer={approveTransfer} />
    </div>
  );
}

export default App;
