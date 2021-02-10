import React, { useEffect, useState } from 'react';
import Header from './Header';
import NewTransfer from './NewTransfer';
import TransferList from './TransferList';
import { web3obj, walletObj } from './utils';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const init = async () => {
      const _web3 = web3obj();
      const _wallet = await walletObj(_web3);
      const _accounts = await _web3.eth.getAccounts();
      const _approvers = await _wallet.methods.getApprovers().call();
      const _quorum = await _wallet.methods.quorum().call();
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

  const sendTransfer = async transfer => {
    wallet.methods.createTransfer(transfer.to, transfer.amount).send({from: accounts[0], gas: '300000'})
    .then(receipt => console.log(receipt));
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
      <h1>Multisig Wallet</h1>
      <Header approvers={approvers} quorum={quorum} />
      <br></br>
      <NewTransfer sendTransfer={sendTransfer} />
      <br></br>
      <br></br>
      <TransferList transfers={transfers} />
    </div>
  );
}

export default App;
