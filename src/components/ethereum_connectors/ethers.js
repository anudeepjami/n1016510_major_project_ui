import { ethers } from "ethers";

var provider,signer;
 
//checks if browser has metmask or anyother wallet configured
if (typeof window.ethereum != "undefined") {
//create web3 provider
  provider = new ethers.providers.Web3Provider(window.ethereum)
//   var test =  async () => await provider.send("eth_requestAccounts", []);
// signer for performing transactions using metamask
  signer = provider.getSigner();
} 
//loads contracts from infura if no ethereum wallets are installed in browser
else {
//create provider instance with infura 
  provider = new ethers.providers.InfuraProvider(
    'rinkeby',
    '0fea43cd4e7541c78c1967a263e7189d'
  )

  signer = new ethers.Wallet('0x013010ea2e56a229b2207f8e21316f27f051e4e43967ee36c342aa568c7b9016', provider);
}

 
export default signer;