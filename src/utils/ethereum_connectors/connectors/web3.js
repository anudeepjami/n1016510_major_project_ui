// Refer references from "React JS references.pdf" in root folder of this application
import Web3 from "web3";


const providerURL = window.location.href.includes("localhost") ? 
    "http://127.0.0.1:7545" : "https://rinkeby.infura.io/v3/d1bcda716078458b90d0962f45b0a1a2";

//create web3 instance with local or infura URL
let web3 = new Web3(providerURL);


export default web3;