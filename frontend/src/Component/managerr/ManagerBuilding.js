import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressCard, faBuilding, faCalendarAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Import SweetAlert for confirmation alerts
import './Manager.css';

const Building = () => {
  const [buildings, setBuildings] = useState([]);
  const [showRoomDetailsModal, setShowRoomDetailsModal] = useState(false);
  const [rooms, setRooms] = useState({});
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchBuildingData = async () => {
    try {
      const buildingsResponse = await axios.get('http://localhost:3001/api/buildingssssss');
      setBuildings(buildingsResponse.data);

      const generatedRooms = {};
      for (const building of buildingsResponse.data) {
        const floorsRoomsResponse = await axios.get(`http://localhost:3001/api/buildings/${building.bldg_id}/floors-rooms`);
        generatedRooms[building.bldg_id] = floorsRoomsResponse.data;
      }
      setRooms(generatedRooms);
    } catch (error) {
      setError('Error fetching building data: ' + (error.response ? error.response.data : error.message));
      console.error('Error fetching building data:', error);
    }
  };

  useEffect(() => {
    fetchBuildingData();
  }, []);

  const getRoomTypeColor = (type) => {
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

  const handleRoomClick = (room, floorNumber) => {
    setSelectedRoom({ ...room, floorNumber });
    setShowRoomDetailsModal(true);
  };

  const handleCloseRoomDetailsModal = () => {
    setShowRoomDetailsModal(false);
    setSelectedRoom(null);
  };

  const handleLogout = () => {
    // Implement your logout logic here
  };

  const confirmReservation = async () => {
    if (!selectedRoom) return;

    const { room_number, RoomType } = selectedRoom;

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Confirm Reservation',
      text: `Are you sure you want to reserve Room ${room_number} (${RoomType})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reserve it!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      // Proceed with reservation logic
      try {
        const response = await axios.post('http://localhost:3001/api/reservations', {
          room_number,
          RoomType,
          // Add other necessary reservation details here
        });

        if (response.data.success) {
          Swal.fire('Success', 'Reservation confirmed!', 'success');
          fetchBuildingData(); // Refresh building data to reflect the new reservation
        } else {
          Swal.fire('Error', response.data.message || 'Failed to confirm reservation.', 'error');
        }
      } catch (error) {
        console.error('Error confirming reservation:', error);
        Swal.fire('Error', 'Failed to confirm reservation. Please try again.', 'error');
      } finally {
        // Reset the selected room and close the modal after the operation
        handleCloseRoomDetailsModal();
      }
    }
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
        <Nav className="flex-column" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Link to="/manager/home" style={linkStyle}>
            <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', marginRight: '10px' }} />
            Home
          </Link>
          <Link to="/manager/agentusers" style={linkStyle}>
            <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '20px', marginRight: '10px' }} />
            Agents
          </Link>
          <Link to="/manager/bldg" style={linkStyle}>
            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '20px', marginRight: '10px' }} />
            Building
          </Link>
          <Link to="/manager/Reservations" style={linkStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '20px', marginRight: '10px' }} />
            Reservations
          </Link>
          <Nav.Link
            onClick={handleLogout}
            style={{
              color: '#fff',
              marginTop: '90px',
              textAlign: 'center',
              padding: '10px',
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '20px', marginRight: '10px' }} />
            Logout
          </Nav.Link>
        </Nav>
      </div>

      <div className="content" style={{ flex: 1, position: 'relative', marginLeft: '100px' }}>
        <Container fluid>
          <div className="floor-room-container" style={{ flexGrow: 1 }}>
            {error && <p className="error-message">{error}</p>}
            {buildings.length > 0 ? (
              <>
                <h2 className="building-header">Buildings and Rooms</h2>
                {buildings.map((building) => (
                  <div key={building.bldg_id}>
                    <h3>{building.bldg_name}</h3>
                    <Table
                      striped
                      bordered
                      hover
                      style={{
                        width: '128%', // Make the table take the full width of the container
                        marginLeft: '-124px', // Optional: Adjust the left margin of the table
                        borderCollapse: 'collapse', // Ensure borders are collapsed for a cleaner look
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
                                        cursor: room.RoomType ? 'pointer' : 'not-allowed',
                                        backgroundColor: room.RoomType ? 'white' : '#f0f0f0',
                                      }}
                                      onClick={() => {
                                        if (room.RoomType) {
                                          handleRoomClick(room, floor.floor_number);
                                        }
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '12px',
                                          height: '12px',
                                          borderRadius: '50%',
                                          backgroundColor: getRoomTypeColor(room.RoomType),
                                          position: 'absolute',
                                          top: '10px',
                                          right: '10px',
                                        }}
                                      />
                                      {`Room ${room.room_number}`}
                                      {!room.RoomType && (
                                        <span
                                          style={{
                                            position: 'absolute',
                                            bottom: '5px',
                                            left: '5px',
                                            fontSize: '12px',
                                            color: 'red',
                                          }}
                                        >
                                          Not Assigned
                                        </span>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p>No rooms available</p>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2">No floors available for this building.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                ))}
              </>
            ) : (
              <p>No buildings available</p>
            )}
          </div>

          {/* Modal for Room Details */}
          <Modal show={showRoomDetailsModal} onHide={handleCloseRoomDetailsModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Room Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRoom && (
                <>
                  <h5 className="section-header">Room Information</h5>
                  <div className="mb-3">
                    <label className="form-label"><strong>Room Number:</strong> {selectedRoom.room_number}</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Room Type:</strong> {selectedRoom.RoomType}</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Room View:</strong> {selectedRoom.view}</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>Floor Number:</strong> {selectedRoom.floorNumber}</label>
                  </div>
                  <Button variant="primary" onClick={confirmReservation}>
                    Confirm Reservation
                  </Button>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseRoomDetailsModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default Building;