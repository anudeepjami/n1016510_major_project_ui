// Refer references from "React JS references.pdf" in root folder of this application
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Card, Button, InputGroup, Form } from 'react-bootstrap';
import { GetWalletDetails, UpdateWalletDetails, DeleteWalletDetails } from '../components/CrowdfundingApi';

function User() {

    const [cookies, setCookie] = useCookies();
    const [walletDetails, setWalletDetails] = useState([]);
    const [emailId, setEmailId] = useState("");

    //this is used for loading state components on page load
    useEffect(() => {
        (async () => {
            await LoadWalletDetails();
        })();
    }, []);

    var LoadWalletDetails = async () => {
        var temp = await GetWalletDetails(cookies.MetamaskLoggedInAddress);
        setWalletDetails(temp);
        if (temp.length != 0) {
            setEmailId(temp[0].email_id);
        }
    }

    var UpdateDetails = async () => {
        if (emailId.includes("@") && emailId != walletDetails[0]?.email_id) {
            await UpdateWalletDetails({
                wallet_address: cookies.MetamaskLoggedInAddress,
                email_id: emailId
            });
            window.alert("email id updated successfully");
            window.location.reload(true);
        }
        else {
            window.alert("email in incorrect format or you are trying to update same email id");
        }
    }

    var RemoveDetails = async () => {

        var temp = await DeleteWalletDetails(cookies.MetamaskLoggedInAddress);
        if(temp.affectedRows == 0)
            window.alert("No email id available in DB to delete");
        else{
            window.alert("Email id deleted successfully....!!");
            window.location.reload(true);
        }

    }

    return (
        <div style={{ width: "60%", margin: "0 auto" }}>
            <br />
            <Card>
                <Card.Header className="text-center">User Form</Card.Header>
                <Card.Body>
                    <div style={{ width: "80%", margin: "0 auto" }}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Ethereum Wallet Address :</InputGroup.Text>
                            <Form.Control
                                placeholder={cookies.MetamaskLoggedInAddress == undefined ? "Connect to Metamask" : cookies.MetamaskLoggedInAddress}
                                disabled={true}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>User Email ID :</InputGroup.Text>
                            <Form.Control
                                placeholder={cookies.MetamaskLoggedInAddress == undefined ? "Connect with Metamask to edit your email address" : walletDetails.length != 0 ? walletDetails[0]?.email_id : "Enter Your Email ID"}
                                disabled={cookies.MetamaskLoggedInAddress == undefined ? true : false}
                                onChange={(e) => { setEmailId(e.target.value) }}
                            />
                        </InputGroup>
                        <div className="text-center">
                            <Button
                                onClick={UpdateDetails}
                                disabled={cookies.MetamaskLoggedInAddress == undefined ? true : false}
                                variant="primary">
                                Save</Button>
                            <div className='d-flex justify-content-end'>
                                <Button
                                    onClick={RemoveDetails}
                                    disabled={cookies.MetamaskLoggedInAddress == undefined || emailId == ""? true : false}
                                    variant="danger">
                                    Remove</Button>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default User