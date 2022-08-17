import signer from "./ethers";
import { ethers } from "ethers";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"

const crowdfundingEventsContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].evm.bytecode.object
};

export function MainContractEthers(){
    return new ethers.Contract(
        '0x54fef7cDaf59D284Ca0620fc06F0a811ed7EA858',
        crowdfundingEventsContract.interface,
        signer
    );
}

