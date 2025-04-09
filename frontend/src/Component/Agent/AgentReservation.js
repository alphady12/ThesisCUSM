import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { InputGroup, FormControl, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './agentreservation.css';

const Reservations = () => {
   const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("All");
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


  const filteredReservations = reservations.filter(
    (reservation) =>
      (filter === "All" || reservation.status === filter) &&
      reservation.Name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleLogout = () => {
    // Remove authentication token from local storage or session storage
    localStorage.removeItem('authToken'); // Adjust based on your implementation

    // Redirect to login page
    navigate('/'); // Make sure the route exists in your app
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
              <h1 className="text-center" style={{ fontSize: "21px", fontWeight: "light", marginTop:'-20px',marginLeft:'-20px' }}>Reservation</h1>

              <div className="search-bar mb-3" style={{ marginTop: "20px", marginLeft:'-20px' }}>
                  <InputGroup>
                    <FormControl
                      type="search"
                      placeholder="Search by Name"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </InputGroup>
                </div>

                <div className="d-flex justify-content-start" style={{ marginTop: '-20px', marginLeft:'-21px', gap: '10px' }}>
  {["All", "Pending", "Reserved", "Cancelled"].map((status) => (
    <Button
      key={status}
      variant={filter === status ? "primary" : "outline-primary"}
      className="me-2 btn-sm"
      style={{ fontSize: '12px', padding: '5px 10px' }}
      onClick={() => setFilter(status)}
    >
      {status}
    </Button>
  ))}
</div>



<div className="ahente-containers" style={{ marginBottom: "-120px", marginLeft: "-21px", marginBottom: '140px' }}>
            <Table striped bordered hover className="ahentereservation-table" style={{ width: "1999px", marginLeft: '-414px', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Room Number</th>
                  <th>Room View</th>
                  <th>Room Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.reservation_id}>
                    <td className="fs-6">{reservation.Name}</td>
                    <td className="fs-6">{reservation.phone_number}</td>
                    <td className="fs-6">{reservation.email}</td>
                    <td className="fs-6">{reservation.Room_number}</td>
                    <td className="fs-6">{reservation.Room_View}</td>
                    <td className="fs-6">{reservation.Room_Type}</td>
                    <td className="fs-6">{formatTimestampToReadable(reservation.start_date)}</td>
                    <td className="fs-6">{formatTimestampToReadable(reservation.end_date)}</td>
                    <td className="fs-6">{reservation.status}</td>
                    <td className="fs-6 text-center">
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
