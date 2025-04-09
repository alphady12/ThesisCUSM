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
    faTable,
    
} from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Condos from './AdminCondos';
import Customers from './AdminCustomers';
import Sales from './AdminSales';
import Building from './AdminBldg';
import FloorRoom from './FloorRoomForm';
import Messages from './Adminmessage';
import Users from './Users';
import HHome from './AdminHome';
import Availability from './Availability';
const Dashboard = () => {
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
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
                        <span>ADMINISTRATOR</span>
                    </div>
                </div>
                <div className="ml-auto d-flex">
                    <Link to="/dashboard/messages" style={{ color: '#fff', textDecoration: 'none', marginRight: '15px' }}>
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
                        <Link to="/dashboard/home" style={linkStyle}>
                            <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Home
                        </Link>
                        <Link to="/dashboard/users" style={linkStyle}>
                            <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Users
                        </Link>
                       
                        <Link to="/dashboard/availability" style={linkStyle}>
                            <FontAwesomeIcon icon={faTable} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Availability
                        </Link>
                       
                        <Link to="/dashboard/bldg" style={linkStyle}>
                            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '20px', marginRight: '10px' }} />
                            Building
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
                            <Route path="/condos" element={<Condos />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/sales" element={<Sales />} />
                            <Route path="/bldg" element={<Building />} />
                            <Route path="/message" element={<Messages />} />
                            <Route path="/floorroomForm/*" element={<FloorRoom />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/home" element={<HHome />} />
                            <Route path="/availability" element={<Availability />} />

                        </Routes>
                    </Container>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;