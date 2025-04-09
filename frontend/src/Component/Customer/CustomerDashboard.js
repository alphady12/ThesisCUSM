import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import Home from './Home';
import Aboutus from './About';
import Rooms from './room';
import Reservation from '../Customer/reservation';
import Contact from './Contact';


import navLogo from './navs.png';

const CustomerDashboard = () => {
    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1.2rem',
        padding: '10px',
        transition: 'background-color 0.3s ease', 
    };

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: 'rgba(139, 0, 0, 0.4)',  
    };

    const navbarStyle = {
        background: '#CA3433',
        color: '#fff',
        fontSize: '1.5rem',
        position: 'fixed',
        padding: '20px',
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999
    };

   
    const location = useLocation();

    return (
        <div>
            <Nav style={navbarStyle}>
              
                <Nav.Item>
                    <img src={navLogo} alt="Logo" style={{ height: '40px', marginLeft: '20px', marginRight: '700px',  transform: 'scale(2.0)' }} />
                </Nav.Item>
              
                <Nav.Item>
                    <Link to="/dashboard2/" style={location.pathname === '/dashboard2/' ? activeLinkStyle : linkStyle}>Home</Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/dashboard2/aboutus" style={location.pathname === '/dashboard2/aboutus' ? activeLinkStyle : linkStyle}>About Us</Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/dashboard2/rooms" style={location.pathname === '/dashboard2/rooms' ? activeLinkStyle : linkStyle}>Rooms</Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/dashboard2/reservation" style={location.pathname === '/dashboard2/reservation' ? activeLinkStyle : linkStyle}>Availability</Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/dashboard2/contact" style={location.pathname === '/dashboard2/contact' ? activeLinkStyle : linkStyle}>Contact Us</Link>
                </Nav.Item>
            </Nav>
            <Container fluid style={{ marginTop: '100px', padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/aboutus" element={<Aboutus />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Container>
        </div>
    );
};

export default CustomerDashboard;