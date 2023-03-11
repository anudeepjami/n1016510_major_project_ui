import React, { useEffect } from 'react'
import { Navbar, Container, Nav, Button, Card, ListGroup } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

function NavigationBar() {

    const [cookies, setCookie] = useCookies();

    //this is used to detect metamask wallet address change
    useEffect(() => {
        if (window.ethereum) {
            (() => {
                // Rerender on meta mask account change
                window.ethereum.on("accountsChanged", async (accounts) => {
                    setCookie('MetamaskLoggedInAddress', accounts[0], { path: '/' });
                    console.log(`MetamaskLoggedInAddress cookie set ${accounts[0]}`);
                });
                // Rerender on meta mask network change
                window.ethereum.on("chainChanged", async (chainId) => {
                    setCookie('MetamaskNetwork', chainId, { path: '/' });
                    console.log(`MetamaskNetwork cookie set to ${chainId}`);
                });
            })();
        }
        else{
            console.log('Please use metamask wallet');
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners("accountsChanged");
                window.ethereum.removeAllListeners("chainChanged");
            }
        }
    }, [cookies, setCookie]);

    return (
        <div>
            <Navbar bg="dark">
                <Container className="d-flex justify-content-between">
                    <Navbar.Brand>
                        <Link to="/">
                            <img width="400" height="100" src={require('../images/companylogo.png')} alt='Company Logo' />
                        </Link>
                    </Navbar.Brand>
                    <Nav>
                        <Link to="/createcrowdfundingevent">
                            <Button variant="primary">
                                Create a Fundraiser
                            </Button>
                        </Link>
                        &nbsp;
                        <Link to="/user">
                            <Button variant="primary">
                                Profile
                            </Button>
                        </Link>
                    </Nav>
                    <Nav>
                        <Navbar.Text>
                            <Card>
                                <Card.Header>
                                    Ethereum Network: 
                                    <b>
                                        <span style={{ color: 'green' }}>
                                            {cookies.MetamaskNetwork === "0x4" && !window.location.href.includes("localhost") && "Rinkeby Network"}
                                            {cookies.MetamaskNetwork === "0x539" && window.location.href.includes("localhost") && "Local Ganache Network"}
                                        </span>
                                        <span style={{ color: 'red' }}>
                                            {cookies.MetamaskNetwork !== "0x4" && !window.location.href.includes("localhost") && "Only Rinkeby Network Supported"}
                                            {cookies.MetamaskNetwork !== "0x539" && window.location.href.includes("localhost") && "Only Local Ganache Network Supported"}
                                        </span>
                                    </b>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <b>
                                            <span style={{ color: 'green' }}>
                                                {cookies.MetamaskLoggedInAddress && cookies.MetamaskLoggedInAddress}
                                            </span>
                                            <span style={{ color: 'red' }}>
                                                {!cookies.MetamaskLoggedInAddress && "Read only mode enabled as Metamask is not logged in"}
                                            </span>
                                        </b>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Navbar.Text>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavigationBar