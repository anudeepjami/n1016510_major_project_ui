// Refer references from "React JS references.pdf" in root folder of this application
import web3 from "./web3";
import signer from "./ethers";
import { ethers } from "ethers";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"
import ContractAddresses from "../ethereum_contracts/ContractAddress.json"

const crowdfundingEventsContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].evm.bytecode.object
};

var contractAddress = window.location.href.includes("localhost") ? ContractAddresses.ganache : ContractAddresses.rinkeby;

export function MainContract(){
    return new web3.eth
    .Contract(
        crowdfundingEventsContract.interface, 
        contractAddress, 
        {handleRevert: true}
    );
}

export function MainContractEthers(){
    return new ethers.Contract(
        contractAddress,
        crowdfundingEventsContract.interface,
        signer
    );
}

