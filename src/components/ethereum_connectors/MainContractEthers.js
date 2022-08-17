import signer from "./ethers";
import { ethers } from "ethers";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"

const crowdfundingEventsContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].evm.bytecode.object
};

export function MainContractEthers(){
    return new ethers.Contract(
        '0x7CaC995882Ebc93dfD5B5c5A3Bcad75c23619db1',
        crowdfundingEventsContract.interface,
        signer
    );
}

