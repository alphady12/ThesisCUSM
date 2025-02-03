import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room_no: '',
    availability: '', // Set default availability
    building: '',
    view: '',
    size: '',
    floor_number: ''
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/room');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/room', formData);
      setFormData({
        room_no: '',
        availability: '',  // Set default availability
        building: '',
        view: '',
        size: '',
        floor_number: ''
      });
      fetchRooms(); // This will fetch the updated list of rooms from the server
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const mapAvailability = (value) => {
    switch (value) {
      case 'Available':
        return 'Available';
      case 'Sold Out':
        return 'Sold Out';
      default:
        return value; // Return the value directly for other cases
    }
  };
 
 
  const handleUpdateModalShow = (room) => {
    setSelectedRoom(room);
    setShowUpdateModal(true);
  };

  const handleReadModalShow = (room) => {
    setSelectedRoom(room);
    setShowReadModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/room/${selectedRoom.room_id}`, formData);
      setShowUpdateModal(false);
      fetchRooms();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDelete = async (roomId) => {
    try {
      await axios.delete(`http://localhost:3001/api/room/${roomId}`);
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h1>Room Management</h1>

          <h2>Add New Room</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formRoomNo">
              <Form.Label>Room Number:</Form.Label>
              <Form.Control type="text" name="room_no" value={formData.room_no} onChange={handleChange} required />
            </Form.Group>
           
            <Form.Group controlId="formAvailability">
  <Form.Label>Room Availability:</Form.Label>
  <Form.Control 
    as="select" 
    name="availability" 
    value={formData.availability} 
    onChange={handleChange} 
    required
  >
    <option value="Available">Available</option>
    <option value="Reserve">Sold Out</option>
  </Form.Control>
</Form.Group>
            <Form.Group controlId="formBuilding">
              <Form.Label>Building:</Form.Label>
              <Form.Control type="text" name="building" value={formData.building} onChange={handleChange} required />
            </Form.Group>
           
            <Form.Group controlId="formView">
              <Form.Label>View:</Form.Label>
              <Form.Control type="text" name="view" value={formData.view} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formSize">
              <Form.Label>Size:</Form.Label>
              <Form.Control type="text" name="size" value={formData.size} onChange={handleChange} required />
            </Form.Group>
           
            <Form.Group controlId="formRoomtype">
  <Form.Label>Room Type:</Form.Label>
  <Form.Select name="roomtype" value={formData.roomtype} onChange={handleChange} required>
    <option value="">Select Room Type</option>
    <option value="Studio Type">Studio Type</option>
    <option value="1Br">1Br</option>
    <option value="2Br">2br</option>
  </Form.Select>
</Form.Group>
           
           
            <Form.Group controlId="formFloorNumber">
              <Form.Label>Floor Number:</Form.Label>
              <Form.Control type="text" name="floor_number" value={formData.floor_number} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">Add Room</Button>
          </Form>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <h2> Room Information</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Availability</th>
                <th>Building</th>
                <th>View</th>
                <th>Size</th>
                <th>RoomType</th>
                <th>Floor Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {rooms.map(room => (
    <tr key={room.room_id}>
      <td>{room.room_no}</td>
      <td>{mapAvailability(room.availability)}</td> {/* Display mapped availability */}
      <td>{room.availability}</td> {/* Display availability directly */}
      <td>{room.view}</td>
      <td>{room.size}</td>
      <td>{room.roomtype}</td>
      <td>{room.floor_number}</td>
      <td>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="info" onClick={() => handleUpdateModalShow(room)}>Update</Button>{' '}
          <Button variant="secondary" onClick={() => handleReadModalShow(room)}>Read</Button>{' '}
          <Button variant="danger" onClick={() => handleDelete(room.room_id)}>Delete</Button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="formRoomNo">
              <Form.Label>Room Number:</Form.Label>
              <Form.Control type="text" name="room_no" value={formData.room_no} onChange={handleChange} required />
            </Form.Group>
           
            <Form.Group controlId="formAvailability">
              <Form.Label>Availability:</Form.Label>
              <Form.Control type="text" name="availability" value={formData.availability} onChange={handleChange} required />
            </Form.Group>
           
            <Form.Group controlId="formRoomNo">
              <Form.Label>Building:</Form.Label>
              <Form.Control type="text" name="building" value={formData.building} onChange={handleChange} required />
            </Form.Group>
           
            <Form.Group controlId="formView">
              <Form.Label>View:</Form.Label>
              <Form.Control type="text" name="view" value={formData.view} onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formSize">
              <Form.Label>Size:</Form.Label>
              <Form.Control type="text" name="size" value={formData.size} onChange={handleChange} required />
            </Form.Group>
           
            <Form.Group controlId="formroomtype">
              <Form.Label>Room Type:</Form.Label>
              <Form.Control type="text" name="roomtype" value={formData.roomtype} onChange={handleChange} required />
            </Form.Group>
           
           
            <Form.Group controlId="formFloorNumber">
              <Form.Label>Floor Number:</Form.Label>
              <Form.Control type="text" name="floor_number" value={formData.floor_number} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">Save changes</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showReadModal} onHide={() => setShowReadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Room Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Room Number: {selectedRoom?.room_no}</h5>
          <p>Availability: {selectedRoom?.availability}</p>
          <p>building: {selectedRoom?.building}</p>
          <p>View: {selectedRoom?.view}</p>
          <p>Size: {selectedRoom?.size}</p>
          <p>Roomtype: {selectedRoom?.roomtype}</p>
          <p>Floor Number: {selectedRoom?.floor_number}</p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReadModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RoomManagement;