import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import './customer.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    editingCustomerId: null
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.editingCustomerId) {
        await axios.put(`http://localhost:3001/api/customers/${formData.editingCustomerId}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/customers', formData);
      }
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        editingCustomerId: null
      });
      fetchCustomers();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding/updating customer:', error.response ? error.response.data : 'Internal Server Error');
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await axios.delete(`http://localhost:3001/api/customers/${customerId}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleEditClick = (customer) => {
    setFormData({
      ...formData,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone_number: customer.phone_number,
      editingCustomerId: customer.id
    });
    setShowModal(true);
  };

  const handleReadClick = (customer) => {
    setSelectedCustomer(customer);
    handleRead(customer);
  };

  const handleRead = (customer) => {
    console.log('Reading customer:', customer);
    alert(`Customer Details:\nFirst Name: ${customer.first_name}\nLast Name: ${customer.last_name}\nEmail: ${customer.email}\nPhone Number: ${customer.phone_number}`);
  };

  return (
    <Container className="customers-container mt-4">
    <Row>
      <Col md={4}>
        <Container className="custom-form-container p-3 border">
          <h2>Add New Customer</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formFirstName">
              <Form.Label column sm="2">First Name:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formLastName">
              <Form.Label column sm="2">Last Name:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm="2">Email:</Form.Label>
              <Col sm="10">
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPhoneNumber">
              <Form.Label column sm="2">Phone Number:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">Create Customer</Button>
          </Form>
        </Container>
      </Col>
      <Col md={8}>
        <Container className="p-3 border">
          <h2>Existing Customers</h2>
          <Table striped bordered hover className="customers-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone_number}</td>
                  <td>
                    <Button variant="info" onClick={() => handleReadClick(customer)} className="mr-2">Read</Button>
                    <Button variant="warning" onClick={() => handleEditClick(customer)} className="mr-2">Edit</Button>
                    <Button variant="danger" onClick={() => deleteCustomer(customer.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Col>
    </Row>
  

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.editingCustomerId ? 'Edit Customer' : 'Customer Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formModalFirstName">
              <Form.Label column sm="2">First Name:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalLastName">
              <Form.Label column sm="2">Last Name:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalEmail">
              <Form.Label column sm="2">Email:</Form.Label>
              <Col sm="10">
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalPhoneNumber">
              <Form.Label column sm="2">Phone Number:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">
              {formData.editingCustomerId ? 'Update Customer' : 'Create Customer'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Customers;