import React, { useEffect, useState } from 'react';
import { web3obj, walletObj } from './utils';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const _web3 = web3obj();
      const _wallet = await walletObj(_web3);
      const _accounts = await _web3.eth.getAccounts();
      setWeb3(_web3);
      setWallet(_wallet);
      setAccounts(_accounts);
    }

    init();
  }, []);

  if(
    typeof web3 === 'undefined' ||
    typeof wallet === 'undefined'||
    typeof accounts === 'undefined'
  ){
    return <h3>Loading......</h3>
  }
  
  return (
    <div className="App">
      Multisig Wallet
    </div>
  );
}

export default App;
