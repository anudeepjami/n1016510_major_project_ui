// Refer references from "React JS references.pdf" in root folder of this application
import React from 'react';
import { Table } from 'react-bootstrap';
import Web3 from 'web3';

function ContributorsTable({ fundDetails }) {
    return (  
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>Contributor</th>
                    <th>Contribution</th>
                    <th>No of Votes</th>
                </tr>
            </thead>
            <tbody>
                {fundDetails[4]?.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td>{item.contributor_address}</td>
                            <td>{Web3.utils.fromWei((item.contributor_votes * fundDetails[3]).toString(), 'ether') + " Eth"}</td>
                            <td>{item.contributor_votes}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default ContributorsTable