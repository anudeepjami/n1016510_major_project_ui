// Refer references from "React JS references.pdf" in root folder of this application
import { ethers } from "ethers";

let provider,signer;
 
//checks if browser has metmask or anyother wallet configured
if (typeof window.ethereum != "undefined") {
//create web3 provider with ethers
  provider = new ethers.providers.Web3Provider(window.ethereum)
//connection request to ethereum wallet
  window.ethereum.request({ method: 'eth_requestAccounts' })
// signer for performing transactions using metamask
  signer = provider.getSigner();
} 
//loads contracts from infura if no ethereum wallets are installed in browser
else {
//create provider instance with infura 
  provider = new ethers.providers.InfuraProvider(
    'rinkeby',
    'd1bcda716078458b90d0962f45b0a1a2'
  )

  signer = new ethers.Wallet('0x013010ea2e56a229b2207f8e21316f27f051e4e43967ee36c342aa568c7b9016', provider);
}

 
export default signer;