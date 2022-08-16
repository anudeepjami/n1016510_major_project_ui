import web3 from "./web3";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"

const crowdfundingEventsContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].evm.bytecode.object
};

const default_instance = new web3.eth
    .Contract(
        crowdfundingEventsContract.interface, 
        '0xcAD4ad9fe53aA0575A1411410DA0B5B323a00CE3', 
        {handleRevert: true}
    );

export default default_instance;