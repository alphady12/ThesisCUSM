
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faCalendarAlt, faSignOutAlt, faAddressCard, faTable } from '@fortawesome/free-solid-svg-icons';
import './rsc.css';

const Reservations = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [rooms, setRooms] = useState({});
  const [reservations, setReservations] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 1, behavior: "smooth" });
  };

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

  const handleBuildingChange = (event) => {
    setSelectedBuilding(event.target.value);
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

      // Set the selected building to the first building if available
      if (buildingsResponse.data.length > 0) {
        setSelectedBuilding(buildingsResponse.data[0].bldg_name);
      }
    } catch (error) {
      setError('Error fetching building data: ' + (error.response ? error.response.data : error.message));
      console.error('Error fetching building data:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reservationss');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const getRoomTypeColor = (type, status, roomNumber) => {
    const isReserved = reservations.some(reservation => reservation.Room_number === roomNumber);
    if (isReserved) {
      const reservation = reservations.find(reservation => reservation.Room_number === roomNumber);
      if (reservation && reservation.status === 'Pending') {
        return 'orange'; // Color for pending confirmation
      }
      return 'gray'; // Color for confirmed reservations
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

  return (
    <div className="nav-links" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div className="Ccontent" style={{ flex: 1, position: 'relative', marginLeft: '-30px', padding: '20px', width: '1270px', marginTop: '-30px' }}>
        <Container fluid>
          <h2 className="building-header" style={{ fontSize: '18px', marginLeft: '-600px', marginTop: '-198px' }}>Buildings and Rooms</h2>

          {error && <p className="error-message">{error}</p>}
          {buildings.length > 0 ? (
            <>
              <div style={{ marginBottom: '60px', marginLeft: '-20px' }}>
                <label htmlFor="building-select">Select a Building:</label>
                <select 
                  id="building-select" 
                  value={selectedBuilding} 
                  onChange={handleBuildingChange} 
                  style={{ width: '100px' }} // Adjust the width as needed
                >
                  <option value="">--Please choose an option--</option>
                  {buildings.map(building => (
                    <option key={building.bldg_id} value={building.bldg_name}>
                      {building.bldg_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBuilding && (
                <div>
                  <Card style={{ width: "300px", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", marginTop: '-50px', marginLeft: '-50px' }}>
                    <Card.Body>
                      <h6 className="mb-2"><strong>Building Name:</strong> {selectedBuilding}</h6>
                      <h6 className="mb-0"><strong>Location:</strong> {buildings.find(b => b.bldg_name === selectedBuilding)?.location}</h6>
                    </Card.Body>
                  </Card>

                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', marginLeft: '450px', marginTop: '-60px' }}>
                    <div style={{ width: '20px', height: '19px', backgroundColor: '#ca3433', marginRight: '5px' }}></div>
                    <span>Studio</span>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', marginLeft: '15px', marginRight: '5px' }}></div>
                    <span>1 Br</span>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#007bff', marginLeft: '15px', marginRight: '5px' }}></div>
                    <span>2 Br</span>
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'gray', marginLeft: '15px', marginRight: '5px' }}></div>
                    <span>Reserved</span>
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'Orange', marginLeft: '15px', marginRight: '5px' }}></div>
                    <span>On Pending</span>
                  </div>

                  <div className="customer-container" style={{ width: '140%', marginLeft: '-180px' }}>
                    <Table className='avail-table' style={{ width: '3955px', minWidth: '300px', marginLeft: '-365px', maxHeight: '400px', overflowY: 'scroll', marginTop: '-22px' }}>
                      <thead>
                        <tr>
                          <th style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10, padding: '15px', width: '90px' }}>Floors</th>
                          <th style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10, padding: '15px' }}>Rooms</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(rooms[buildings.find(b => b.bldg_name === selectedBuilding)?.bldg_id]) ? (
                          rooms[buildings.find(b => b.bldg_name === selectedBuilding)?.bldg_id].map((floor) => (
                            <tr key={floor.floor_id}>
                              <td>{floor.floor_number}</td>
                              <td>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '50px' }}>
                                  {floor.rooms.length ? (
                                    [...floor.rooms] // Create a new sorted array
                                      .sort((a, b) => a.room_number - b.room_number) // Sort in ascending order
                                      .map((room) => {
                                        const isReserved = reservations.some(reservation => reservation.Room_number === room.room_number && reservation.status === 'Reserved');
                                        const isPending = reservations.some(reservation => reservation.Room_number === room.room_number && reservation.status === 'Pending');
                                        return (
                                          <div
                                            key={room.room_id}
                                            style={{
                                              border: '1px solid #ccc',
                                              padding: '10px',
                                              textAlign: 'center',
                                              position: 'relative',
                                              cursor: room.RoomType ? 'pointer' : 'not-allowed',
                                              backgroundColor: isReserved ? 'gray' : room.RoomType ? 'white' : '#f0f0f0',
                                              borderRadius: '8px',
                                              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
                                              display: 'flex',
                                              flexDirection: 'column',
                                              justifyContent: 'center',
                                              gap: '20px',
                                              alignItems: 'center',
                                              width: '125px',
                                              height: '80px',
                                              fontWeight:'bold',
                                              overflow: 'hidden',
                                            }}
                                            onClick={() => {
                                              if (!isReserved && room.RoomType) {
                                                handleRoomClick(room, floor.floor_number);
                                              }
                                            }}
                                          >
                                            {isPending && (
                                              <div style={{ color: 'orange', fontSize: '12px', fontWeight: 'bold' }}>
                                                Pending
                                              </div>
                                            )}
                                            <div
                                              style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: getRoomTypeColor(room.RoomType, room.status, room.room_number),
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                              }}
                                            />
                                            {isReserved && (
                                              <div style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                                                Reserved
                                              </div>
                                            )}
                                            <span
                                              style={{
                                                wordWrap: 'break-word',
                                                whiteSpace: 'nowrap',
                                                overflow: 'break-word',
                                                maxWidth: '70px',
                                                fontSize: '14px',
                                                textAlign: 'center',
                                              }}
                                            >
                                              <p>{room.room_number}</p>
                                              <p>{room.view}</p>
                                            </span>
                                            {!room.RoomType && (
                                              <span style={{ fontSize: '10px', color: 'red' }}>
                                                Not Assigned
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })
                                  ) : (
                                    <span>No rooms available</span>
                                  )}
                                </div>
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
                </div>
              )}
            </>
          ) : (
            <p>No buildings available.</p>
          )}
        </Container>
      </div>

      {/* Modal for Reservation Form */}
      <Modal show={showReservationModal} onHide={handleCloseReservationModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Room Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReservationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reservations;
