import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { InputGroup, FormControl, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './agentreservation.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    Name: '',
    phone_number: '',
    email: '',
    Room_number: '',
    Room_View: '',
    Room_Type: '',
    floor: '',
    start_date: '',
    end_date: '',
    status: ''
  });


  const [statusFilter, setStatusFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);


  useEffect(() => {
    fetchReservations();
  }, []);


  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reservationss');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const filteredReservations = reservations.filter(reservation =>
    reservation.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter ? reservation.status.toLowerCase() === statusFilter : true)
  );


  const handleEditClick = (reservation) => {
    setCurrentReservation(reservation);  
    setFormData({
      Name: reservation.Name,
      phone_number: reservation.phone_number,
      email: reservation.email,
      Room_number: reservation.Room_number,
      Room_View: reservation.Room_View,
      Room_Type: reservation.Room_Type,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      status: reservation.status
    });
    setIsEditing(true);  
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/reservationsss/${currentReservation.reservation_id}`, formData);
      fetchReservations();  
      setIsEditing(false);
      setCurrentReservation(null);
      Swal.fire('Updated!', 'The reservation has been updated.', 'success');
    } catch (error) {
      console.error('Error updating reservation:', error);
      Swal.fire('Error!', 'There was a problem updating the reservation.', 'error');
    }
  };


  const formatTimestampToReadable = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };


  return (
    <div className="scontainer">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div style={{ marginTop: '50px' }}>
            <h1 className="text-center">Reservation Details</h1>
          </div>
          <div className="search-bar mb-2">
            <InputGroup className="search-group">
              <FormControl
                type="search"
                placeholder="Search by Name"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </div>


          <div className="d-flex justify-content-start mb-3">
            <Button
              variant="outline-primary"
              onClick={() => setStatusFilter('')}
              className="me-2"
            >
              All
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setStatusFilter('pending')}
              className="me-2"
            >
              Pending
            </Button>
            <Button
              variant="outline-success"
              onClick={() => setStatusFilter('reserved')}
              className="me-2"
            >
              Reserved
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setStatusFilter('cancelled')}
              className="me-2"
            >
              Cancelled
            </Button>
          </div>


          <div className="sscrollable-table-container">
            <Table striped bordered hover className="reservation-table mt-2">
              <thead>
                <tr>
                  <th style={{ width: "110px", textAlign: "center" }}>Name</th>
                  <th style={{ width: "119px", textAlign: "center" }}>Phone Number</th>
                  <th style={{ width: "150px", textAlign: "center" }}>Email</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Room Number</th>
                  <th style={{ width: "120px", textAlign: "center" }}>Room View</th>
                  <th style={{ width: "110px", textAlign: "center" }}>Room Type</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Start Date</th>
                  <th style={{ width: "100px", textAlign: "center" }}>End Date</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Status</th>
                  <th style={{ width: "146px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.reservation_id}>
                    <td className="fs-6"><span>{reservation.Name}</span></td>
                    <td className="fs-6"><span>{reservation.phone_number}</span></td>
                    <td className="fs-6"><span>{reservation.email}</span></td>
                    <td className="fs-6"><span>{reservation.Room_number}</span></td>
                    <td className="fs-6"><span>{reservation.Room_View}</span></td>
                    <td className="fs-6"><span>{reservation.Room_Type}</span></td>
                    <td className="fs-6"><span>{formatTimestampToReadable(reservation.start_date)}</span></td>
                    <td className="fs-6"><span>{formatTimestampToReadable(reservation.end_date)}</span></td>
                    <td className="fs-6"><span>{reservation.status}</span></td>
                    <td className="fs-6 text-center">
                      {/* Edit button */}
                      <Button variant="warning" onClick={() => handleEditClick(reservation)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>


        {/* Edit Reservation Modal */}
        <Modal show={isEditing} onHide={() => setIsEditing(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Reservation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formRoomNumber">
                <Form.Label>Room Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.Room_number}
                  disabled={(e) => setFormData({ ...formData, Room_number: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formRoomView">
                <Form.Label>Room View</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.Room_View}
                  disabled={(e) => setFormData({ ...formData, Room_View: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formRoomType">
                <Form.Label>Room Type</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.Room_Type}
                  disabled={(e) => setFormData({ ...formData, Room_Type: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.status}
                  disabled={(e) => setFormData({ ...formData, status: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" type="submit">Save Changes</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};


export default Reservations;
