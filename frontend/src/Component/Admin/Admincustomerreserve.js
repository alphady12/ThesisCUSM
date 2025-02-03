import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 

const Customerinforeservation = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/customerinfo');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await axios.delete(`http://localhost:3001/api/customerinfo/${customerId}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleUpdateModalOpen = (customer) => {
    setSelectedCustomer(customer);
    setShowUpdateModal(true);
  };
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const handleUpdateModalClose = () => {
    setSelectedCustomer(null);
    setShowUpdateModal(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/customerinfo/${selectedCustomer.customerinfr_id}`, selectedCustomer);
      fetchCustomers(); 
      setShowUpdateModal(false); 
    } catch (error) {
      console.error('Error updating customer information:', error);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleReadModalOpen = (customer) => {
    setSelectedCustomer(customer);
    setShowReadModal(true);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Existing Reservation</h2>
      <Table striped bordered hover style={{ marginLeft: '50px', marginTop: '50px' }}> 
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Building</th>
            <th>Room Number</th>
            <th>Reserve View</th>
            <th>Room Type</th>
            <th>Payment</th>
            <th>Floor Number</th>
            <th>Reserve Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.customerinfr_id}>
              <td>{customer.NAME}</td>
              <td>{customer.PHONE}</td>
              <td>{customer.BUILDING}</td>
              <td>{customer.ROOM_num}</td>
              <td>{customer.ROOM_view}</td>
              <td>{customer.ROOM_type}</td>
              <td>{customer.pay_send}</td>
              <td>{customer.Floor}</td>
              <td>{customer.Reserve_date}</td>
              <td>
                <div className="d-flex">
                  <Button className="me-2" variant="info" onClick={() => handleUpdateModalOpen(customer)}>Update</Button>
                  <Button className="me-2" variant="primary" onClick={() => handleReadModalOpen(customer)}>Read</Button>
                  <Button variant="danger" onClick={() => deleteCustomer(customer.customerinfr_id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
  

      {/* Modal for updating customer */}
      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Customer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="NAME" value={selectedCustomer && selectedCustomer.NAME} onChange={handleUpdateChange} required />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="PHONE" value={selectedCustomer && selectedCustomer.PHONE} onChange={handleUpdateChange} required />
            </Form.Group>
            <Form.Group controlId="formBuilding">
              <Form.Label>Building</Form.Label>
              <Form.Control type="text" name="BUILDING" value={selectedCustomer && selectedCustomer.BUILDING} onChange={handleUpdateChange} required />
            </Form.Group>
           
            <Form.Group controlId="formRoom_num">
              <Form.Label>Room Number</Form.Label>
              <Form.Control type="text" name="ROOM_num" value={selectedCustomer && selectedCustomer.ROOM_num} onChange={handleUpdateChange} required />
            </Form.Group>

            <Form.Group controlId="formROOM_view">
              <Form.Label>View</Form.Label>
              <Form.Control type="text" name="ROOM_view" value={selectedCustomer && selectedCustomer.ROOM_view} onChange={handleUpdateChange} required />
            </Form.Group>

            <Form.Group controlId="formROOM_type">
              <Form.Label>Room Type</Form.Label>
              <Form.Control type="text" name="ROOM_type" value={selectedCustomer && selectedCustomer.ROOM_type} onChange={handleUpdateChange} required />
            </Form.Group>
            
            <Form.Group controlId="formfloor">
              <Form.Label>Floor</Form.Label>
              <Form.Control type="text" name="floor" value={selectedCustomer && selectedCustomer.floor} onChange={handleUpdateChange} required />
            </Form.Group>

            <Form.Group controlId="formpay_send">
              <Form.Label>Paymen Amount</Form.Label>
              <Form.Control type="text" name="pay_send" value={selectedCustomer && selectedCustomer.pay_send} onChange={handleUpdateChange} required />
            </Form.Group>

            <Form.Group controlId="formReserve_date">
  <Form.Label>Date</Form.Label>
  <DatePicker
    selected={selectedDate} // Make sure to manage selected date state
    onChange={date => setSelectedDate(date)} // Set selected date state
    dateFormat="yyyy-MM-dd" // Adjust date format as needed
    name="Reserve_date"
    
  />
</Form.Group>
            
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showReadModal} onHide={() => setShowReadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <div>
              <p>Name: {selectedCustomer.NAME}</p>
              <p>Phone: {selectedCustomer.PHONE}</p>
              <p>Building: {selectedCustomer.BUILDING}</p>
              <p>roomnumber: {selectedCustomer.ROOM_num}</p>
              <p>view: {selectedCustomer.ROOM_view}</p>
              <p>Room Type: {selectedCustomer.ROOM_type}</p>
              <p>payment: {selectedCustomer.paysend}</p>
              <p>Date Reserved: {selectedCustomer.Reserve_date}</p>
              {/* Add other fields here */}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Customerinforeservation;