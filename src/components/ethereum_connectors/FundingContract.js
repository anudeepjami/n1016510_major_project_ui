import web3 from "./web3";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"
import { ethers } from "ethers";

const crowdfundingEventContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvent'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvent'].evm.bytecode.object
};


export function FundingContract(EventAddress){
    return new web3.eth
    .Contract(
        crowdfundingEventContract.interface, 
        EventAddress, 
        {handleRevert: true}
    );
}

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export function FundingContractEthers(EventAddress){
    return new ethers.Contract(
        EventAddress,
        crowdfundingEventContract.interface,
        signer
    );
}