import Web3 from "web3";
import Wallet from "./contracts/Wallet.json";

const web3obj = () => new Web3('http://localhost:9545');

const walletObj = async web3Inst => {
    const networkId = await web3Inst.eth.net.getId();
    const deployedContr = Wallet.networks[networkId];
    return new web3Inst.eth.Contract(
        Wallet.abi,
        deployedContr && deployedContr.address              // 'and' operation is to check if contract deployment is fine??
    );
}

export { web3obj, walletObj }
