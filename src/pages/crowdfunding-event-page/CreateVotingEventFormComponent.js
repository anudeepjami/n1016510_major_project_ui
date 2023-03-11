import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

function CreateVotingEventFormComponent({createVotingEventDetails, setCreateVotingEventDetails, viewRefund, setViewRefund, CreateVotingEvent, createVotingEventButtonStatus}) {
    console.log(createVotingEventDetails);
    return (
        <>
            <Form>
                <Form.Check
                    inline
                    label="Disbursal Request"
                    name="group1"
                    type='radio'
                    checked={!viewRefund}
                    onChange={() => setViewRefund(false)}
                />
                <Form.Check
                    inline
                    label="Refund Request"
                    name="group1"
                    type='radio'
                    checked={viewRefund}
                    onChange={() => setViewRefund(true)}
                />
            </Form>
            <br />
            <InputGroup className="mb-3">
                <InputGroup.Text>Request Title</InputGroup.Text>
                <Form.Control
                    id='1'
                    placeholder="Enter Title"
                    aria-describedby="basic-addon2"
                    onChange={(e)=>{setCreateVotingEventDetails({...createVotingEventDetails, title: e.target.value})}}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Request Description</InputGroup.Text>
                <Form.Control
                    id='2'
                    placeholder="Enter Descrption"
                    aria-describedby="basic-addon2"
                    onChange={(e)=>{setCreateVotingEventDetails({...createVotingEventDetails, description: e.target.value})}}
                />
            </InputGroup>
            {!viewRefund &&
                <InputGroup className="mb-3">
                    <InputGroup.Text>Destination Wallet Address</InputGroup.Text>
                    <Form.Control
                        id='3'
                        placeholder="Enter Wallet Address"
                        aria-describedby="basic-addon2"
                        onChange={(e)=>{setCreateVotingEventDetails({...createVotingEventDetails, destination_address: e.target.value})}}
                    />
                </InputGroup>
            }
            {!viewRefund &&
                <InputGroup className="mb-3">
                    <InputGroup.Text>Eth</InputGroup.Text>
                    <Form.Control
                        id='4'
                        placeholder="Enter how much Ether you want to send"
                        aria-describedby="basic-addon2"
                        onChange={(e)=>{setCreateVotingEventDetails({...createVotingEventDetails, deposit_amount: e.target.value})}}
                        type="number"
                    />
                </InputGroup>
            }

            {/* View or Hide voting events */}
            <Button
                id={viewRefund ? "refund" : "disbursal"}
                variant={viewRefund ? "danger" : "primary"}
                type="submit"
                disabled={createVotingEventButtonStatus}
                onClick={CreateVotingEvent}
            >
                Create {viewRefund ? "Refund" : "Disbursal"} Request
            </Button>
            {/*  */}

            <br /><br />
        </>
    )
}

export default CreateVotingEventFormComponent