import web3 from "./web3";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"

const crowdfundingEventsContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].evm.bytecode.object
};

export function MainContract(){
    return new web3.eth
    .Contract(
        crowdfundingEventsContract.interface, 
        '0x7CaC995882Ebc93dfD5B5c5A3Bcad75c23619db1', 
        {handleRevert: true}
    );
}

