import web3 from "./web3";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"

const crowdfundingEventsContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].evm.bytecode.object
};

const maincontract = new web3.eth
    .Contract(
        crowdfundingEventsContract.interface, 
        '0x54fef7cDaf59D284Ca0620fc06F0a811ed7EA858', 
        {handleRevert: true}
    );

export default maincontract;
