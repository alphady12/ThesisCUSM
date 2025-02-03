import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { Link, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faCalendarAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Reservation.css';

const Reservations = () => {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState({});
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [reservationData, setReservationData] = useState({
    Name: '',
    email: '',
    phone_number: '',
    start_date: '',
    end_date: '',
    status: 'Pending',
  });

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  };

  const fetchBuildingData = async () => {
    try {
      const buildingsResponse = await axios.get('http://localhost:3001/api/buildingssssss');
      setBuildings(buildingsResponse.data);

      const generatedRooms = {};
      for (const building of buildingsResponse.data) {
        const floorsRoomsResponse = await axios.get(
          `http://localhost:3001/api/buildings/${building.bldg_id}/floors-rooms`
        );
        generatedRooms[building.bldg_id] = floorsRoomsResponse.data;
      }
      setRooms(generatedRooms);
    } catch (error) {
      setError('Error fetching building data: ' + (error.response ? error.response.data : error.message));
      console.error('Error fetching building data:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reservationss');
      setReservations(response.data);
      updateRoomStatuses(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const updateRoomStatuses = (reservations) => {
    setRooms((prevRooms) => {
      const updatedRooms = { ...prevRooms };
      for (const reservation of reservations) {
        const roomNumber = reservation.Room_number;
        updatedRooms[reservation.bldg_id] = updatedRooms[reservation.bldg_id]?.map((floor) => {
          return {
            ...floor,
            rooms: floor.rooms.map((room) => {
              if (room.room_number === roomNumber && reservation.status === 'Reserved') {
                return { ...room, status: 'Reserved' };
              }
              return room;
            }),
          };
        }) || [];
      }
      return updatedRooms;
    });
  };

  const getRoomTypeColor = (type, status, roomNumber) => {
    const isReserved = reservations.some(reservation => reservation.Room_number === roomNumber && reservation.status === 'Reserved');
    if (isReserved || status === 'Disabled') {
      return 'gray';
    }
    switch (type) {
      case '1Br':
        return '#28a745';
      case '2Br':
        return '#007bff';
      case 'Studio':
        return '#ca3433';
      default:
        return 'gray';
    }
  };

  const handleCloseReservationModal = () => {
    setShowReservationModal(false);
    setSelectedRoom(null);
    setReservationData({
      Name: '',
      email: '',
      phone_number: '',
      start_date: '',
      end_date: '',
      status: 'Pending',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData({
      ...reservationData,
      [name]: value,
    });
  };

  const createReservation = async () => {
    const { Name, email, phone_number, start_date, end_date } = reservationData;

    if (!Name || !email || !phone_number || !start_date || !end_date || !selectedRoom) {
      Swal.fire('Error', 'Please fill out all fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      Swal.fire('Error', 'Please enter a valid email address.', 'error');
      return;
    }

    const isRoomReserved = reservations.some(reservation => 
      reservation.Room_number === selectedRoom.room_number &&
      ((new Date(start_date) >= new Date(reservation.start_date) && new Date(start_date) <= new Date(reservation.end_date)) ||
       (new Date(end_date) >= new Date(reservation.start_date) && new Date(end_date) <= new Date(reservation.end_date)))
    );

    if (isRoomReserved) {
      Swal.fire('Error', 'This room is already reserved for the selected dates.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to create this reservation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'No, go back',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('Name', Name);
        formData.append('email', email);
        formData.append('phone_number', phone_number);
        formData.append('start_date', start_date);
        formData.append('end_date', end_date);
        formData.append('selectedRoom[room_number]', selectedRoom.room_number);
        formData.append('selectedRoom[view]', selectedRoom.view);
        formData.append('selectedRoom[Room_Type]', selectedRoom.RoomType);

        try {
          const response = await axios.post('http://localhost:3001/api/reservations', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.data.errors) {
            Swal.fire('Error', response.data.errors.join(', '), 'error');
          } else {
            Swal.fire('Success', 'Reservation created successfully. Please wait for the confirmation.', 'success');
            fetchReservations();
            setReservationData({
              Name: '',
              email: '',
              phone_number: '',
              start_date: '',
              end_date: '',
            });
            setSelectedRoom(null);
          }
        } catch (error) {
          console.error('Error creating reservation:', error);
          Swal.fire('Error', 'Failed to create the reservation. Please try again.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchBuildingData();
    fetchReservations();

    const intervalId = setInterval(() => {
      fetchReservations();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRoomClick = (room, floorNumber) => {
    const isReserved = reservations.some(reservation => reservation.Room_number === room.room_number && reservation.status === 'Reserved');

    if (isReserved || room.status === 'Reserved' || room.status === 'Disabled') {
      return;
    }

    setSelectedRoom({ ...room, floor: floorNumber });
    setShowReservationModal(true);
  };

  const handleLogout = () => {
    // Implement logout functionality
  };

  return (
    <div className="d-flex" style={{ height: '100vh', backgroundColor: '#fff', marginTop: '56px' }}>
      <div className="sidebar" style={{
          background: '#CA3433',
          color: '#fff',
          padding: '20px',
          width: '180px',
          height: "100vh",
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
      }}>
        <h3 style={{ marginBottom: '30px', fontSize: '20px', textAlign: 'center' }}>ADMIN</h3>
        <div className="nav-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Link to="/agent/home" style={linkStyle}>
            <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', marginRight: '10px' }} />
            Home
          </Link>
          <Link to="/agent/bldg" style={linkStyle}>
            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '20px', marginRight: '10px' }} />
            Building
          </Link>
          <Link to="/agent/reservations" style={linkStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '20px', marginRight: '10px' }} />
            Reservations
          </Link>
          <div
            onClick={handleLogout}
            style={{
              color: '#fff',
              marginTop: '90px',
              textAlign: 'center',
              padding: '10px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '20px', marginRight: '10px' }} />
            Logout
          </div>
        </div>
      </div>

      <div className="content" style={{ flex: 1, position: 'relative', marginLeft: '100px', padding: '20px', width: '1130px' }}>
        <Container fluid>
          <h2 className="building-header">Buildings and Rooms</h2>
          {error && <p className="error-message">{error}</p>}
          {buildings.length > 0 ? (
            <>
              {buildings.map((building) => (
                <div key={building.bldg_id}>
                  <h3>{building.bldg_name}</h3>
                  <Table
                    striped
                    bordered
                    hover
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ padding: '15px', textAlign: 'center', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Floors</th>
                        <th style={{ padding: '15px', textAlign: 'center', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>Rooms</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(rooms[building.bldg_id]) ? (
                        rooms[building.bldg_id].map((floor) => (
                          <tr key={floor.floor_id}>
                            <td>{floor.floor_number}</td>
                            <td style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {floor.rooms.length ? (
                                floor.rooms.map((room) => (
                                  <div
                                    key={room.room_id}
                                    style={{
                                      border: '1px solid #ccc',
                                      padding: '15px',
                                      minWidth: '60px',
                                      textAlign: 'center',
                                      position: 'relative',
                                      cursor: room.status === 'Reserved' || room.status === 'Disabled' ? 'not-allowed' : 'pointer',
                                      backgroundColor: getRoomTypeColor(room.RoomType, room.status, room.room_number),
                                    }}
                                    onClick={() => handleRoomClick(room, floor.floor_number)}
                                  >
                                    <span>{room.room_number}</span>
                                  </div>
                                ))
                              ) : (
                                <div>No rooms available.</div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              ))}
            </>
          ) : (
            <p>No buildings available.</p>
          )}
        </Container>
      </div>

      {/* Modal for Reservation Form */}
      <Modal show={showReservationModal} onHide={handleCloseReservationModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reserve Room {selectedRoom?.room_number}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="section-header">Room Information</h5>
          <div className="mb-3">
            <label className="form-label"><strong>Room Number:</strong> {selectedRoom?.room_number}</label>
          </div>
          <div className="mb-3">
            <label className="form-label"><strong>Room Type:</strong> {selectedRoom?.RoomType}</label>
          </div>
          <div className="mb-3">
            <label className="form-label"><strong>Room View:</strong> {selectedRoom?.view}</label>
          </div>
          <div className="mb-3">
            <label className="form-label"><strong>Floor:</strong> {selectedRoom?.floor}</label>
          </div>
          <h5 className="section-header">Reservation Details</h5>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="Name"
              value={reservationData.Name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={reservationData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control"
              name="phone_number"
              value={reservationData.phone_number}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              name="start_date"
              value={reservationData.start_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              name="end_date"
              value={reservationData.end_date}
              onChange={handleInputChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReservationModal}>
            Close
          </Button>
          <Button variant="primary" onClick={createReservation}>
            Create Reservation
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reservations;