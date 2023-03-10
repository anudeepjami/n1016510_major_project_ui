// Refer references from "React JS references.pdf" in root folder of this application   
import web3 from "./connectors/web3";
import signer from "./connectors/ethers";
import { ethers } from "ethers";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"

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

export function FundingContractEthers(EventAddress){
    return new ethers
    .Contract(
        EventAddress,
        crowdfundingEventContract.interface,
        signer
    );
}
