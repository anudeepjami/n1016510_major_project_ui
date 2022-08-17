import Web3 from "web3";

var web3;
 
//checks if browser has metmask or anyother wallet configured
if (typeof window.ethereum != "undefined") {
//create metamask instance
  window.ethereum.request({ method: "eth_requestAccounts" });
//load from metamask
  web3 = new Web3(window.ethereum);
} 
//loads contracts from infura if no ethereum wallets are installed in browser
else {
//create infura instance
  const infura = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/0fea43cd4e7541c78c1967a263e7189d"
  );
//load infura instance
  web3 = new Web3(infura);
}
 
export default web3;