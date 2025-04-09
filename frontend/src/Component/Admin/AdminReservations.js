import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Adminreservation.css';

const Reservations = () => {
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

      // Fetch floors and rooms for each building
      for (const building of buildingsResponse.data) {
        const floorsRoomsResponse = await axios.get(`http://localhost:3001/api/buildings/${building.bldg_id}/floors-rooms`);
        generatedRooms[building.bldg_id] = floorsRoomsResponse.data; // Store floors and rooms by building ID
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

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowRoomDetailsModal(true); // Show room details modal
  };

  const handleCloseRoomDetailsModal = () => {
    setShowRoomDetailsModal(false);
    setSelectedRoom(null);
  };

  return (
    <Container fluid className="admin-container">
      {/* Sidebar for Room Type Legend */}
      <div className="sidebar">
        <h4 style={{ fontSize: '22px' }}>Room Type Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: '#ca3433' }}></div>
            <span>Studio</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: '#28a745' }}></div>
            <span>1BR</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: '#007bff' }}></div>
            <span>2BR</span>
          </div>
          <div className="legend-item">
            <div className="color-box" style={{ backgroundColor: '#6c757d' }}></div>
            <span>Unknown</span>
          </div>
        </div>
      </div>

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
                                  key={room.room_id} // Use room_id as the key
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
                                      handleRoomClick(room);
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
                                  {`Room ${room.room_number}`} {/* Display room number */}
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
                <label className="form-label"><strong>Floor Number:</strong> {selectedRoom.floor_id}</label>
              </div>
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
  );
};

export default Reservations;