import signer from "./ethers";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"
import { ethers } from "ethers";

const crowdfundingEventContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvent'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvent'].evm.bytecode.object
};


export function FundingContractEthers(EventAddress){
    return new ethers.Contract(
        EventAddress,
        crowdfundingEventContract.interface,
        signer
    );
}