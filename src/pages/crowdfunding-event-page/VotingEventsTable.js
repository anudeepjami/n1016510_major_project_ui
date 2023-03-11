// Refer references from "React JS references.pdf" in root folder of this application
import React from 'react';
import { Cookies } from 'react-cookie';
import {  Table } from 'react-bootstrap';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';

function VotingEventsTable( {votingEventDetails}) {

    //creating cookies object from react-cookie
    const cookies = new Cookies();
    // React router navigate hook
    const navigate = useNavigate();
    
    return (
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                    <th>Request Title</th>
                    <th>Destination Wallet</th>
                    <th>Transfer Amount</th>
                    <th>Voting Status</th>
                </tr>
            </thead>
            <tbody>
                {votingEventDetails?.map((item, index) => {
                    return (
                        <tr key={index}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                cookies.set('VotingIndex', index, { path: '/' });
                                navigate("/votingevent");
                            }}>
                            <td>{item.title}{item.refund_event ? <span style={{ color: 'red' }}><b> (Refund Request)</b></span> : <span style={{ color: 'green' }}><b> (Disbursal Request)</b></span>}</td>
                            <td>{!item.refund_event ? item.destination_wallet_address : `All contributors of this fundraiser`}</td>
                            <td>{`${Web3.utils.fromWei((item.amount_to_send).toString(), 'ether')} Eth`}</td>
                            <td style={{ color: !item.event_completion_status ? 'blue' : item.event_success_status ? 'green' : 'red' }}>
                                {
                                    !item.event_completion_status ? 'In Progress' : item.event_success_status ? 'Successful' : "Failed"
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default VotingEventsTable