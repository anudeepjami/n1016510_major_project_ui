import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Card, Button, InputGroup, Form } from 'react-bootstrap';
import { GetWalletDetails, UpdateWalletDetails } from '../components/CrowdfundingApi';

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

    var UpdateDetails = async (e) => {
        if (emailId.includes("@") && emailId != walletDetails[0].email_id) {
            await UpdateWalletDetails({
                wallet_address: cookies.MetamaskLoggedInAddress,
                email_id: emailId
            });
            window.alert("email id updated successfully");
        }
        else {
            window.alert("email in incorrect format or you are trying to update same email id");
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
                            <InputGroup.Text>User Email id :</InputGroup.Text>
                            <Form.Control
                                placeholder={cookies.MetamaskLoggedInAddress == undefined ? "Connect with Metamask to edit your email address" : walletDetails.length != 0 ? walletDetails[0]?.email_id : "Enter Your Email id"}
                                disabled={cookies.MetamaskLoggedInAddress == undefined ? true : false}
                                onChange={(e) => { setEmailId(e.target.value) }}
                            />
                        </InputGroup>
                        <div className="text-center">
                            <Button
                                onClick={UpdateDetails}
                                disabled={cookies.MetamaskLoggedInAddress == undefined ? true : false}
                                variant="primary">
                                Save Changes</Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default User