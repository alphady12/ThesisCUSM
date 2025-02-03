import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import locationImage from './futura monte.jpeg';


const Contact = () => {
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [showLocationImage, setShowLocationImage] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3001/api/messages", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            setMessage('Message sent successfully');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setMessage('Error sending message');
            console.error("Error sending message:", error);
        }
    };


    const handleButtonHover = () => {
        setButtonHovered(true);
    };


    const handleButtonLeave = () => {
        setButtonHovered(false);
    };


    const [buttonHovered, setButtonHovered] = useState(false);


    const navbarHeight = '75px';


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
    };


    const buttonStyle = {
        ...styles.button,
        backgroundColor: buttonHovered ? '#af2d27' : '#CA3433',
    };


    const openLocationImage = () => {
        setShowLocationImage(true);
    };


    const closeLocationImage = () => {
        setShowLocationImage(false);
    };


    return (
        <div className="contact" style={contentStyle}>
            <div style={{ ...styles.container, fontFamily: 'Verdana, sans-serif' }}>
                <div style={styles.wrapper}>
                    <div style={styles.formSection}>
                        <h1 style={styles.header}>Get in Touch!</h1>
                        <p style={styles.subHeader}>
                            Have any questions or inquiries? Contact us using the form below:
                        </p>
                        {message && <p style={styles.message}>{message}</p>}
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <label style={styles.label}>
                                <span style={styles.labelText}>Name:</span>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={styles.input}
                                    placeholder="Enter your name"
                                />
                            </label>
                            <label style={styles.label}>
                                <span style={styles.labelText}>Email:</span>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    style={styles.input}
                                    placeholder="Enter your email"
                                />
                            </label>
                            <label style={styles.label}>
                                <span style={styles.labelText}>Message:</span>
                                <textarea
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    style={styles.textarea}
                                    placeholder="Your message here..."
                                />
                            </label>
                            <button
                                type="submit"
                                style={buttonStyle}
                                onMouseEnter={handleButtonHover}
                                onMouseLeave={handleButtonLeave}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                    <div style={{ ...styles.formSection, ...styles.contactInfoSection }}>
                        <div style={styles.socialContainer}>
                            <p style={styles.contactInfo}><strong>Contact Information</strong></p>
                            <p style={styles.infoText}>
                                Phone: <strong>Insert Phone Number Here</strong>
                            </p>
                            <p style={styles.infoText}>
                                Hours: Monday-Friday 08:00 am - 05:00 pm
                            </p>
                            <p style={styles.followUs}><strong>Follow Us:</strong></p>
                            <div style={styles.socialIcons}>
                                <a href="https://www.facebook.com/FuturaByFilinvest/" target="_blank" rel="noopener noreferrer" style={styles.icon}>
                                    <FontAwesomeIcon icon={faFacebook} style={{ fontSize: '36px', color: '#3b5998' }} />
                                </a>
                                <a href="https://www.instagram.com/futurabyfilinvest/" target="_blank" rel="noopener noreferrer" style={styles.icon}>
                                    <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '36px', color: '#bc2a8d' }} />
                                </a>
                                <a href="https://www.youtube.com/c/FuturabyFilinvest" target="_blank" rel="noopener noreferrer" style={styles.icon}>
                                    <FontAwesomeIcon icon={faYoutube} style={{ fontSize: '36px', color: '#c4302b' }} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={styles.locationSection}>
                    <h2 style={styles.locationHeader}>Location Details</h2>
                    <div style={styles.locationContainer}>
                        <img
                            src={locationImage}
                            alt="Location"
                            style={styles.locationImage}
                            onClick={openLocationImage}
                        />
                        <p style={{ ...styles.locationText, color: '#000' }}>
                            <strong>Location:</strong>
                            <li>Conveniently located on Roxas Ave. in Brgy. Triangulo, near major establishments, schools, hospitals, and government offices.</li>
                        </p>
                        <p style={{ ...styles.locationText, color: '#000' }}><strong>Landmarks:</strong></p>
                        <ul style={styles.landmarkList}>
                            <li>M Plaza – 100 m</li>
                            <li>USI Mother Seton Hospital – 100 m</li>
                            <li>Bicol Medical Center – 600 m</li>
                            <li>Our Lady of the Immaculate Concepcion Parish – 600 m</li>
                            <li>S&R Naga – 950 m</li>
                            <li>Bicol Central Station – 1.3 km</li>
                            <li>Naga City Hall – 1.5 km</li>
                            <li>Naga City Science High School – 1.8 km</li>
                        </ul>
                    </div>
                </div>
                {showLocationImage && (
                    <div style={styles.imageModal}>
                        <div style={styles.modalContent}>
                            <span className="close" style={styles.closeButton} onClick={closeLocationImage}>&times;</span>
                            <img src={locationImage} alt="Location" style={styles.modalImage} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#f9f9f9',
        overflowY: 'auto',
    },
    wrapper: {
        display: 'flex',
        maxWidth: '1200px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '20px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
    },
    formSection: {
        flex: '1',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    },
    contactInfoSection: {
        flex: '1',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    },
    header: {
        textAlign: 'center',
        fontSize: '32px',
        color: '#333',
        marginBottom: '20px',
    },
    subHeader: {
        marginBottom: '20px',
        fontSize: '16px',
        textAlign: 'center',
        color: '#666',
    },
    message: {
        textAlign: 'center',
        color: '#4CAF50',
        marginBottom: '10px',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '10px',
        fontSize: '14px',
        color: '#333',
        display: 'flex',
    },
    labelText: {
        width: '80px',
        marginRight: '10px',
    },
    input: {
        flex: '1',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
        marginBottom: '10px',
    },
    textarea: {
        flex: '1',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        minHeight: '80px',
        fontSize: '14px',
        marginBottom: '10px',
    },
    button: {
        alignSelf: 'flex-start',
        padding: '10px 20px',
        backgroundColor: '#CA3433',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px',
        fontFamily: 'Verdana, sans-serif',
        transition: 'background-color 0.3s ease',
    },
    locationSection: {
        flex: '1',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
    },
    locationHeader: {
        textAlign: 'center',
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    locationContainer: {
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
    },
    locationImage: {
        width: '100%',
        maxWidth: '300px',
        borderRadius: '10px',
        marginBottom: '10px',
        cursor: 'pointer',
    },
    locationText: {
        marginBottom: '10px',
        fontSize: '14px',
        color: '#000',
        textAlign: 'left',
    },
    landmarkList: {
        paddingLeft: '20px',
        marginBottom: '10px',
        textAlign: 'left',
    },
    socialContainer: {
        textAlign: 'center',
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '90px',
        backgroundColor: '#fff',
    },
    contactInfo: {
        marginBottom: '10px',
        fontSize: '18px',
        color: '#333',
    },
    infoText: {
        marginBottom: '10px',
        fontSize: '14px',
        color: '#666',
        textAlign: 'left',
    },
    followUs: {
        marginBottom: '10px',
        fontSize: '18px',
        color: '#333',
    },
    socialIcons: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
    },
    icon: {
        marginRight: '10px',
    },
    imageModal: {
        position: 'fixed',
        zIndex: 1000,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fefefe',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '90%',
        maxHeight: '90%',
        overflow: 'auto',
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: 'auto',
        borderRadius: '10px',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '24px',
        color: '#333',
        cursor: 'pointer',
    },
};


export default Contact;





