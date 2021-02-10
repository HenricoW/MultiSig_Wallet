import Web3 from "web3";
import Wallet from "./contracts/Wallet.json";

const web3obj = () => {
    return new Promise((resolve, reject) => {               // web3 connection now becomes async, converted to Promise
        window.addEventListener('load', async () => {             // wait for all page elements (& extentions) to have loaded
            if(window.ethereum){                            // test for MetaMask
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();         // request user to allow Dapp interaction
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            } else if(window.web3) {                        // test for old MetaMask
                resolve(window.web3);
            } else {
                reject('Need to install Metamask');
            }
        });
    });
}

const walletObj = async web3Inst => {
    const networkId = await web3Inst.eth.net.getId();
    const deployedContr = Wallet.networks[networkId];
    return new web3Inst.eth.Contract(
        Wallet.abi,
        deployedContr && deployedContr.address              // 'and' operation is to check if contract deployment is fine??
    );
}

export { web3obj, walletObj }
