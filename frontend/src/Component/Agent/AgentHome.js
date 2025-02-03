import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Carousel, Nav, Navbar } from 'react-bootstrap';
import { FaBuilding, FaRegCalendarAlt } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressCard, faCalendarAlt, faSignOutAlt, faEnvelope, faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';

import homeImage1 from './home.jpg';
import homeImage2 from './home2.jpg';
import homeImage3 from './home3.jpg';

import fsImage1 from './fs1.jpg';
import fsImage2 from './fs2.jpg';
import fsImage3 from './fs3.jpg';
import fsImage4 from './fs4.jpg';
import fsImage5 from './fs5.jpg';
import fsImage6 from './fs6.jpg';
import fsImage7 from './fs7.jpg';
import fsImage8 from './fs8.jpg';
import fsImage10 from './fs10.jpg';
import fsImage11 from './fs11.jpg';
import fsImage12 from './fs12.jpg';
import './homeeee.css';

const Home = () => {
    const [currentSet, setCurrentSet] = useState(1);
    const carouselRef = useRef(null);

    const images = [
        fsImage1, fsImage2, fsImage3, fsImage4, fsImage5,
        fsImage6, fsImage7, fsImage8, fsImage10, fsImage11, fsImage12
    ];

    const duplicatedImages = [...images, ...images, ...images];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSet(prev => (prev >= duplicatedImages.length - 1 ? 1 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [duplicatedImages.length]);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.style.transition =
                currentSet === 1 || currentSet === duplicatedImages.length - 1
                    ? 'none'
                    : 'transform 0.5s ease-in-out';
            carouselRef.current.style.transform = `translateX(-${(currentSet / duplicatedImages.length) * 100}%)`;
        }
    }, [currentSet, duplicatedImages.length]);

    const handleLogout = () => {
        // Logout logic
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

    const buttonStyle = {
        backgroundColor: '#CA3433',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        marginRight: '10px'
    };

     return (
            <div>
                <Navbar style={navbarStyle} expand="lg">
                    <div className="d-flex align-items-center">
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <FontAwesomeIcon icon={faUser} style={{ fontSize: '24px', marginRight: '10px' }} />
                            <span>AGENT</span>
                        </div>
                    </div>
                    <div className="ml-auto d-flex">
                        <Link to="/agent/messages" style={{ color: '#fff', textDecoration: 'none', marginRight: '15px' }}>
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
                            <Link to="/agent/home" style={linkStyle}>
                                <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', marginRight: '10px' }} />
                                Home
                            </Link>
                            <Link to="/agent/bldg" style={linkStyle}>
                                <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '20px', marginRight: '10px' }} />
                                Building
                            </Link>
                            <Link to="/agent/reservations" style={linkStyle}>
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
    

                    <Container fluid style={{ padding: '0' }}>
  <Row>
    <Col>
      <Carousel style={{ width: '1172px', marginLeft: '80px', marginTop: '-51px', }}> {/* Increase width here */}
        {[homeImage1, homeImage2, homeImage3].map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={image}
              alt={`Slide ${index + 1}`}
              style={{
                maxHeight: '500px',
                width: '100%', // Ensures the image fills the carousel
                objectFit: 'cover', // This ensures the image maintains aspect ratio and covers the space
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </Col>
  </Row>

                    <Row className="text-center mt-4">
                        <Col>
                            <Link to="/dashboard2/rooms" className="btn btn-lg" style={buttonStyle}>
                                <FaBuilding /> Explore Condos
                            </Link>
                            <Link to="/dashboard2/reservation" className="btn btn-lg" style={buttonStyle}>
                                <FaRegCalendarAlt /> Make Reservation
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Home;
