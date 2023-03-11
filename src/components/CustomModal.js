import React from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Modal } from 'react-bootstrap';

function CustomModal({modal, setModal}) {

    return (

        <div>
            <Modal
                show={modal.msg}
                onHide={async () => {
                    setModal({...modal, pop: false, msg:""});
                }}
                size="lg"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>AJ Hybrid DAO Crowdfunding Platform</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <b style={{ color: modal.msg.includes('progress') ? 'blue' : modal.msg.includes('Error') || modal.msg.includes('Login') ? 'red' : 'green' }}
                            dangerouslySetInnerHTML={{ __html: modal.msg }}>
                        </b>
                    </div>
                    {
                        modal.msg.includes('progress') ?
                            <div style={{ float: "right" }}>
                                <CountdownCircleTimer
                                    isPlaying
                                    duration={30}
                                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                    colorsTime={[20, 15, 10, 5]}
                                    size="90">
                                    {({ remainingTime }) => remainingTime}
                                </CountdownCircleTimer>
                            </div>
                            : <></>}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CustomModal