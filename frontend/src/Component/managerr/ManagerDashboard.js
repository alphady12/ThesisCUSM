import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faBuilding,
    faCalendarAlt,
    faSignOutAlt,
    faHome,
    faAddressCard,
    faBell,
    faEnvelope,
    faTable
} from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';






import CreateAgent from './CreateAgent';


import Building from './ManagerBuilding';
import Messages from './ManagerMessages';
import HHome from './ManagerHome';
import Reservations from './ManagerReservaation';












const Dashboard = () => {
    const navigate = useNavigate();




    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/ManagerLogin');
    };




    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    };




    const navbarStyle = {
        background: '#CA3433',
        color: '#fff',
        fontSize: '1.5rem',
        position: 'fixed',
        padding: '8px',
        justifyContent: 'space-between',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        borderBottom: '1px solid #ccc'
    };




    return (
        <div>
            <Navbar style={navbarStyle} expand="lg">
                <div className="d-flex align-items-center">
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: '24px', marginRight: '10px' }} />
                        <span>MANAGER</span>
                    </div>
                </div>
                <div className="ml-auto d-flex">
                    <Link to="/manager/messages" style={{ color: '#fff', textDecoration: 'none', marginRight: '15px' }}>
                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                    </Link>
                </div>
            </Navbar>
            <div className="d-flex" style={{ height: '100vh', backgroundColor: '#fff', marginTop: '56px' }}>
                <div className="sidebar" style={{
                    background: '#CA3433',
                    color: '#fff',
                    padding: '20px',
                    width: '180px',
                    height: "100vh",
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <h3 style={{ marginBottom: '30px', fontSize: '20px', textAlign: 'center' }}>ADMIN</h3>




                    <Nav className="flex-column" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <Link to="/manager/home" style={linkStyle}>
                            <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Home
                        </Link>
                        <Link to="/manager/agents" style={linkStyle}>
                            <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Agents
                        </Link>
                        <Link to="/manager/bldg" style={linkStyle}>
                            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '20px', marginRight: '10px' }} />
                           Availability
                        </Link>
                        <Link to="/manager/Reservations" style={linkStyle}>
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Reservations
                        </Link>
                        <Nav.Link
                            onClick={handleLogout}
                            style={{
                                color: '#fff',
                                marginTop: '90px',
                                textAlign: 'center',
                                padding: '10px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Logout
                        </Nav.Link>
                    </Nav>
                </div>




                <div className="content" style={{ flex: 1, position: 'relative', marginLeft: '100px' }}>
                    <Container fluid>
                        <Routes>
                            <Route path="/reservations" element={<Reservations/>}/>
                            <Route path="/bldg" element={<Building />} />
                            <Route path="/message" element={<Messages />} />
                            <Route path="/agents" element={<CreateAgent />} />
                            <Route path="/home" element={<HHome />} />
                        </Routes>
                    </Container>
                </div>
            </div>
        </div>
    );
};




export default Dashboard;













