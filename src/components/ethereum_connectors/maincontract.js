import web3 from "./web3";
import CrowdfundingEventsContract from "../ethereum_contracts/CrowdfundingEvents.json"

const crowdfundingEventsContract = {
    interface: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].abi,
    bytecode: CrowdfundingEventsContract.contracts['CrowdfundingEvents.sol']['CrowdfundingEvents'].evm.bytecode.object
};

const default_instance = new web3.eth
    .Contract(
        crowdfundingEventsContract.interface, 
        '0x11CD56ED8E7Fd01931F932444CEECcaAF6Fb9Fd8', 
        {handleRevert: true}
    );

export default default_instance;