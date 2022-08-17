import Web3 from "web3";


// provide infura interface to load Crodfunding Contract data
const infura = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/d1bcda716078458b90d0962f45b0a1a2");

//create web3 instance with infura API
var web3 = new Web3(infura);


export default web3;