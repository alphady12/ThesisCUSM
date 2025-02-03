import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import { FaBuilding, FaRegCalendarAlt } from 'react-icons/fa';

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

const Home = () => {
    const [currentSet, setCurrentSet] = useState(1);
    const carouselRef = useRef(null);

    const images = [
        fsImage1,
        fsImage2,
        fsImage3,
        fsImage4,
        fsImage5,
        fsImage6,
        fsImage7,
        fsImage8,
        fsImage10,
        fsImage11,
        fsImage12
    ];

    const duplicatedImages = [...images, ...images, ...images];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSet(prev => {
                if (prev >= duplicatedImages.length - 1) {
                    return 1;
                }
                return prev + 1;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentSet === 0) {
            setCurrentSet(duplicatedImages.length - 2);
        } else if (currentSet === duplicatedImages.length - 1) {
            setCurrentSet(1);
        }
    }, [currentSet, duplicatedImages.length]);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.style.transition = currentSet === 1 || currentSet === duplicatedImages.length - 1 ? 'none' : 'transform 0.5s';
            carouselRef.current.style.transform = `translateX(-${(currentSet / duplicatedImages.length) * 100}%)`;
        }
    }, [currentSet, duplicatedImages.length]);

    return (
        <section style={contentStyle}>
            <Container fluid className="p-0">
                <Row className="justify-content-center align-items-center w-100 m-0">
                    <Col md={12} className="p-0">
                        <Carousel interval={3000} pause={false} className="carousel-container" style={{ width: '100%', height: '100vh' }}>
                            {[homeImage1, homeImage2, homeImage3].map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={image}
                                        alt={`Slide ${index + 1}`}
                                        style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                </Row>
            </Container>

            <div className="navbar-carousel-container">
                <Container>
                    <Row className="justify-content-center mt-4">
                        <Col md="auto">
                            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                                <Link to="/dashboard2/rooms" className="btn btn-lg" style={buttonStyle}>
                                    <FaBuilding style={{ marginRight: '8px' }} />
                                    Explore Condos
                                </Link>
                                <Link to="/dashboard2/reservation" className="btn btn-lg" style={buttonStyle}>
                                    <FaRegCalendarAlt style={{ marginRight: '8px' }} />
                                    Make Reservation
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container
                fluid
                style={{
                    transform: 'translateY(-590px)',
                    transition: 'transform 0.3s ease', // Optional for smooth animation
                }}
            >
                <Row className="justify-content-center mt-3 w-100 m-0">
                    <Col md={12} className="text-center">
                        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#CA3433', marginTop: '10px' }}>
                            THE HEART OF FUTURA
                        </h1>
                        <p style={{ fontSize: '16px', color: '#333', marginTop: '5px' }}>
                            Take the first step towards independence with Futura by Filinvest. We understand the hard work it takes to fulfill your dream of a stable future for your loved ones. This is why we honor your efforts with smart-value homes and nurturing communities in highly-accessible locations. Your family needs all the love and care, so we provide the comfort and ease you dream of in a Futura home.
                        </p>
                    </Col>
                </Row>
            </Container>

            <Container
                fluid
                style={{
                    transform: 'translateY(-570px)',
                    transition: 'transform 0.3s ease', // Optional for smooth animation
                }}
            >
                <Row className="justify-content-center mt-3 w-100 m-0">
                    <Col md={12} style={{ position: 'relative', maxHeight: '400px' }} className="p-0">
                        <div
                            className="image-carousel-container"
                            style={{ position: 'relative', overflow: 'hidden', height: '100%' }}
                        >
                            <div
                                ref={carouselRef}
                                className="image-carousel"
                                style={{
                                    display: 'flex',
                                    transition: 'transform 0.5s',
                                    transform: `translateX(-${(currentSet / duplicatedImages.length) * 100}%)`,
                                }}
                            >
                                {duplicatedImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Image ${index + 1}`}
                                        style={{ width: 'calc(33.33% - 20px)', margin: '10px', cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

const navbarHeight = '74px';

const contentStyle = {
    position: 'fixed',
    top: navbarHeight,
    bottom: '0',
    left: '0',
    right: '0',
    maxHeight: `calc(100vh - ${navbarHeight})`,
    overflowY: 'auto',
    margin: '0',
    padding: '0',
    background: '#fff',
    zIndex: 999,
    fontFamily: 'Verdana, sans-serif',
};

const buttonStyle = {
    backgroundColor: '#CA3433',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    position: 'relative', // Keeps button positioned relative to its container
    transform: 'translateY(-289px)', // Moves the button upwards by 144px (~3 inches)
};

export default Home;
