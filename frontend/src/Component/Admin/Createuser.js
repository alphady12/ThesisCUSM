import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './create.css';
import signUpImage from './Dashboard.png';


function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });


  const [showModal, setShowModal] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/users', formData);
      console.log(response.data);
      setFormData({
        name: '',
        email: '',
        password: ''
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Internal Server Error. Please try again later.');
    }
  };


  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login');
  };


  return (
    <div className="container">
      <div className="image-holder">
        <img src={signUpImage} alt="Sign Up" />
      </div>
      <div className="create-container">
        <h2 className="create-title">SIGN UP</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input"
              required
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input"
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input"
              required
            />
          </Form.Group>
          <Button variant="danger" type="submit" className="register-button">
            Register
          </Button>
        </Form>
        <div style={{ marginTop: '10px' }}>
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Registration Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>User registered successfully. You can now log in.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}


export default RegistrationForm;





