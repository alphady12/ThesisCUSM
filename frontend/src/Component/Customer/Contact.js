import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import locationImage from './futura monte.jpeg';


const Contact = () => {
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [showLocationImage, setShowLocationImage] = useState(false);
    const [buttonHovered, setButtonHovered] = useState(false);


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
        <div style={{ ...styles.containers, fontFamily: 'Verdana, sans-serif' }}>
            <div style={styles.wrapper}>
                {/* Form Section */}
                <div style={styles.formSection}>
                    <h1 style={styles.header}>Let's Connect!</h1>
                    <p style={styles.subHeader}>Feel free to reach out with any questions or inquiries!</p>
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
                                required
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
                                required
                            />
                        </label>
                        <label style={styles.label}>
                            <span style={styles.labelText}>Message:</span>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                style={styles.textarea}
                                placeholder="Your message here..."
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            style={buttonStyle}
                            onMouseEnter={handleButtonHover}
                            onMouseLeave={handleButtonLeave}
                        >
                            Send Message
                        </button>
                    </form>
                </div>


                    {/* Contact Info Section */}
                    <div style={{ ...styles.formSection, ...styles.contactInfoSection }}>
                        <p style={styles.contactInfo}><strong>Contact Info</strong></p>
                        <p style={styles.infoText}>Phone: <strong>Insert Phone Number Here</strong></p>
                        <p style={styles.infoText}>Hours: Monday-Friday 08:00 am - 05:00 pm</p>
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


                {/* Location Section */}
                <div style={styles.locationSection}>
                    <h2 style={styles.locationHeader}><strong>Location: </strong> </h2>
                    <div style={styles.locationContainer}>
                        <img
                            src={locationImage}
                            alt="Location"
                            style={styles.locationImage}
                            onClick={openLocationImage}
                        />
                     
                        {/* <p style={{ ...styles.locationText, fontWeight: 'bold', fontSize: '18px', color: '#000' }}>Location:


                        </p> */}
    <ul style={{ ...styles.landmarkList, paddingLeft: '20px', color: '#000', fontSize: '16px' }}>
        <li>Conveniently located on Roxas Ave. in Brgy. Triangulo, near major establishments, schools, hospitals, and government offices.
        </li>
    </ul>
    <p style={{ ...styles.locationText, fontWeight: 'bold', fontSize: '18px', color: '#000' }}>Nearby Landmarks:</p>
    <ul style={{ ...styles.landmarkList, paddingLeft: '20px', color: '#000', fontSize: '16px' }}>
        <li>
            M Plaza – 100 m</li>
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


                {/* Embedded Google Map */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.5477952378975!2d123.183818!3d13.621775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3398e6f5a49b6e69%3A0x22f73e5a2eb4a6cf!2sFutura%20By%20Filinvest!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
                    width="95%" height="500" style={{border: 0}} allowFullScreen="" loading="lazy">
                </iframe>
            </div>
        </div>
    );
};


const styles = {
    containers: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#f9f9f9',
        width: '50%',
        marginLeft:'200px',
        transform: 'scale(0.8)',
        marginTop:'-150px',
        marginLeft:'405px'
    },
    wrapper: {
        display: 'flex',
        maxWidth: '3200px',
        width: '280%',
        boxSizing: 'border-box',
        marginBottom: '20px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        
    },
    formSection: {
        flex: '1',
        padding: '5px',
    },
    header: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#CA3433',
        marginBottom: '15px',
    },
    subHeader: {
        fontSize: '18px',
        marginBottom: '20px',
        color: '#555',
    },
    message: {
        fontSize: '18px',
        color: '#28a745',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '15px',
    },
    labelText: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '5px',
    },
    input: {
        width: '80%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginLeft: '10px',
    },
    textarea: {
        
        width:'200%',
        width:'760px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        height: '100px',
    },
    button: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        width:'95%',
        width:'300px',
        marginLeft: '350px',
    },
    contactInfoSection: {
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '600px',
        alignItems: 'center',
    },
    contactInfo: {
        fontSize: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        marginTop: '85px',
        color: '#CA3433',


    },
    infoText: {
        fontSize: '16px',
        marginBottom: '30px',
        color: '#555',
        marginLeft:'60px',
       
    },
    followUs: {
        fontSize: '18px',
        marginTop: '85px',
        textAlign: 'center',
    },
   
    socialIcons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '25px',
        marginTop: '10px',
    },
   
    icon: {
        textDecoration: 'none',
        fontSize: '24px',
        color: '#555',
        transition: 'color 0.3s',
    },
   
    iconHovered: {
        color: '#CA3433',
    },
   
    locationSection: {
        padding: '20px',
        backgroundColor: '#fff',
        marginTop: '20px',
    },
    locationHeader: {
        fontSize: '24px',
        marginBottom: '15px',
        color: '#CA3433',
    },
    locationContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    locationImage: {
        width: '50%',
        cursor: 'pointer',
        borderRadius: '5px',
    },
    locationText: {
        fontSize: '16px',
        color: '#555',
    },
    landmarkList: {
        fontSize: '14px',
        color: '#555',
        listStyle: 'none',
        paddingLeft: '0',
    },
    imageModal: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        position: 'relative',
        maxWidth: '90%',
        maxHeight: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '30px',
        color: '#fff',
        cursor: 'pointer',
    },
    modalImage: {
        width: '100%',
        height: 'auto',
        borderRadius: '10px',
    },
    
   
};


export default Contact;
