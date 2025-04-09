import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import Uma1Image from './Uma1.jpg';
import Uma2Image from './Uma2.jpg';
import Uma3Image from './Uma3.jpg';


const navbarHeight = '75px';


const buttonStyle = {
    backgroundColor: '#ca3433',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '20px'
};


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


const AboutUs = () => {
    return (
        <div className="about-us" style={contentStyle}>
            <header style={{ backgroundImage: `url(${Uma1Image})` }}>
                <div className="header-overlay"></div>
                <div className="header-content">
                <h2 style={{ fontSize: '30px', textAlign: 'center',color:'black',fontWeight:'light-bold' }}>
  Your Ideal Modern City Home
</h2>
                    <p>Savor independence and pursue your passions at Futura Monte, a smart-value, mid-rise community featuring spacious units, breathable open spaces, and refreshing amenities in a prime location in Naga City. Crafted with care by Filinvest, it is a modern city home where you can enjoy your bright future.</p>
                    <p>A Well-Planned Community: With four mid-rise, modern minimalist buildings set amid open spaces and a secure environment, Futura Monte is the ideal community for settling down, achieving your dreams, and growing your family. It is designed with your health in mind as 60% of the total property is dedicated to breathable open spaces and amenities.</p>
                </div>
            </header>


            <main className="main-content">
                <section id="what-sets-us-apart">
                    <h2>What Sets Us Apart</h2>
                    <ul>
                        <li>Commitment to Quality</li>
                        <li>Community Focus</li>
                        <li>Sustainability Initiatives</li>
                        <li>Customer Satisfaction</li>
                    </ul>
                </section>


                <section id="our-portfolio">
                    <h2>Our Portfolio</h2>
                    <div className="portfolio-images">
                        <img src={Uma1Image} alt="Uma 1" />
                        <img src={Uma2Image} alt="Uma 2" />
                        <img src={Uma3Image} alt="Uma 3" />
                    </div>
                </section>


                <section id="features-amenities">
                    <h2>Features and Amenities</h2>
                    <ul>
                        <li>Clubhouse</li>
                        <li>Swimming Pool</li>
                        <li>Children’s Play Area</li>
                        <li>Fitness Gym</li>
                    </ul>
                    <p>Unwind and bond with your loved ones right at the community’s healthy amenities.</p>
                </section>


                <section id="video">
                    <h2>WELCOME TO FUTURA MONTE NAGA</h2>
                    <div className="video-container">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/myw4utrOpaU"
                            title="Futura Monte Community Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </section>


                <section id="join-us">
                    <h2>Reach Out to Us</h2>
                    <p>Discover the Futura Monte difference and envision your future with us. Contact our team to learn more.</p>
                    <Link to="/dashboard2/contact" className="btn btn-lg" style={buttonStyle}>Contact Us</Link>
                </section>
            </main>
        </div>
    );
}


export default AboutUs;





