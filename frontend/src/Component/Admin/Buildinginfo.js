
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Card } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faEnvelope, faHome, faAddressCard, faTable, faBuilding, faCalendarAlt,faClipboard, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './buildinginfo.css';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [changeHistory, setChangeHistory] = useState({});
  const [showChangeHistoryModal, setShowChangeHistoryModal] = useState(false);
  const [totalRoomsSetUp, setTotalRoomsSetUp] = useState(0);
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState('');
  const [showAddRoomsModal, setShowAddRoomsModal] = useState(false);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [numRooms, setNumRooms] = useState(0);
  const [numFloorsToAdd, setNumFloorsToAdd] = useState(0);
  const [floorIdForAddRooms, setFloorIdForAddRooms] = useState(null);
  const [showAddFloorsModal, setShowAddFloorsModal] = useState(false);
  const [showSetupRoomsModal, setShowSetupRoomsModal] = useState(false);
  const [roomType, setRoomType] = useState('Studio');
  const [price, setPrice] = useState(1000);
  const [view, setView] = useState('Nature View');
  const [floorIdForSetupRooms, setFloorIdForSetupRooms] = useState(null);
  const [roomsForSetup, setRoomsForSetup] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roomNumber, setRoomNumber] = useState(null);
  const [numRoomsToSetup, setNumRoomsToSetup] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const date = new Date('2025-04-09T09:23:05');
const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
const formattedTime = date.toLocaleTimeString('en-US', options);
console.log(formattedTime); // Outputs: "9:23:05 AM"
  

  const fetchBuildingDetails = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`http://localhost:3001/api/buildingsss/${id}`);
      setBuilding(response.data.building);
      const floorsWithRooms = response.data.floors.map(floor => ({
        ...floor,
        rooms: [],
      }));
      setFloors(floorsWithRooms);
      setTotalRoomsSetUp(0);
    } catch (err) {
      console.error('Error fetching building details:', err);
      setError('Building not found.');
    } finally {
      setLoading(false); // End loading
    }
  };
  const getRoomImage = (roomType) => {
    switch (roomType) {
      case 'Studio':
        return require('./studio.jpeg'); // No need to include the full path
      case '1Br':
        return require('./1br.jpeg'); // No need to include the full path
      case '2Br':
        return require('./2br.jpeg'); // No need to include the full path
    // No need to include the full path
    }
  };
  const fetchRoomsForFloor = async (floorId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/buildingsssssss/${id}/rooms/${floorId}`);
      const updatedFloors = floors.map(floor =>
        floor.floor_id === floorId
          ? { ...floor, rooms: response.data.rooms }
          : floor
      );
      setFloors(updatedFloors);
    } catch (err) {
      console.error('Error fetching rooms for floor:', err);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/buildingssssss/${id}/rooms/${floorIdForSetupRooms}/available`);
      const availableRooms = response.data.availableRooms;
      setAvailableRooms(availableRooms - totalRoomsSetUp);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  useEffect(() => {
    fetchBuildingDetails();
  }, [id]);

  useEffect(() => {
    if (floorIdForSetupRooms) {
      fetchAvailableRooms();
    }
  }, [floorIdForSetupRooms]);

  useEffect(() => {
    if (floors.length > 0) {
      floors.forEach(floor => {
        if (floor.rooms.length === 0) {
          fetchRoomsForFloor(floor.floor_id);
        }
      });
    }
  }, [floors]);

  const handleAddRooms = (floorId) => {
    setFloorIdForAddRooms(floorId);
    setShowAddRoomsModal(true);
  };

  const handleAddFloors = async () => {
    const floorsToAdd = Number(numFloorsToAdd);
    
    if (floorsToAdd <= 0) {
      Swal.fire('Error', 'Please enter a valid number of floors to add.', 'error');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:3001/api/buildingssssss/${id}/add-floors`,
        { numFloorsToAdd: floorsToAdd }
      );
  
      const successMessage = response.data.message || `${floorsToAdd} floor(s) added successfully.`;
      Swal.fire('Success', successMessage, 'success');
      
      setShowAddFloorsModal(false);
      fetchBuildingDetails();
    } catch (error) {
      console.error('Error adding floors:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.error || 'There was an error adding floors. Please try again.';
      Swal.fire('Error', errorMessage, 'error');
    }
  };
  
  const handleSubmitAddRooms = async () => {
    if (numRooms <= 0) {
      Swal.fire('Error', 'Please enter a valid number of rooms.', 'error');
      return;
    }
    try {
      // Optimistically update the floors state
      const updatedFloors = floors.map(floor => {
        if (floor.floor_id === floorIdForAddRooms) {
          return {
            ...floor,
            rooms: [
              ...floor.rooms,
              ...Array.from({ length: numRooms }, (_, index) => ({
                room_number: floor.rooms.length + index + 1, // Assign new room numbers
                isSetUp: false // Default value, no details yet
              }))
            ]
          };
        }
        return floor;
      });
      setFloors(updatedFloors);

      await axios.post(`http://localhost:3001/api/buildingssssss/${id}/rooms/${floorIdForAddRooms}`, { numRooms });
      Swal.fire('Success', `${numRooms} room(s) added successfully to floor ${floorIdForAddRooms}.`, 'success');
      setShowAddRoomsModal(false);
      // Update available rooms after adding rooms
      setAvailableRooms(prev => prev + numRooms);
    } catch (error) {
      console.error('Error adding rooms:', error);
      Swal.fire('Error', 'There was an error adding rooms. Please try again.', 'error');
    }
  };

  const handleSetUpRooms = (floorId) => {
    const floor = floors.find(f => f.floor_id === floorId);
    if (!floor || !floor.rooms || floor.rooms.length === 0) {
        Swal.fire('Warning', 'Please add rooms first!', 'warning');
    } else {
        // Create a new array of rooms with modified identifiers
        const modifiedRooms = floor.rooms.map((room, index) => ({
            ...room,
           
        }));

        setFloorIdForSetupRooms(floorId);
        setRoomsForSetup(modifiedRooms); // Use the modified rooms array
        setShowSetupRoomsModal(true);
    }
};

const handleSubmitSetupRooms = async () => {
  try {
      const response = await axios.get(`http://localhost:3001/api/buildingssssss/${id}/rooms/${floorIdForSetupRooms}/available`);
      const availableRooms = response.data.availableRooms;

      if (numRoomsToSetup > availableRooms) {
          Swal.fire('Error', `You can only set up ${availableRooms} rooms on this floor.`, 'error');
          return;
      }

      // Generate room data without including the floor ID in the display name
      const roomsData = Array.from({ length: numRoomsToSetup }).map(() => ({
          RoomType: roomType,
          price: price,
          view: view
      }));

      const setupResponse = await axios.post(`http://localhost:3001/api/buildingsetup/${id}/rooms/${floorIdForSetupRooms}/setup`, {
          numRooms: numRoomsToSetup,
          rooms: roomsData
      });

      Swal.fire('Success', setupResponse.data.message, 'success');
      setShowSetupRoomsModal(false);
      setTotalRoomsSetUp(prev => prev + numRoomsToSetup);
      // Update available rooms after setting up rooms
      setAvailableRooms(prev => prev - numRoomsToSetup);
      fetchBuildingDetails(); // Optionally refresh data from server
  } catch (error) {
      console.error('Error setting up rooms:', error);
      const errorMessage = error.response?.data?.error || error.message || 'There was an error setting up rooms. Please try again.';
      Swal.fire('Error', errorMessage, 'error');
  }
};

  const getRoomTypeColor = (type) => {
    switch (type) {
      case 'Studio':
        return '#ca3433'; // Red for Studio
      case '1Br':
        return '#28a745'; // Green for 1 Bedroom
      case '2Br':
        return '#007bff'; // Blue for 2 Bedrooms
      default:
        return 'gray'; // Gray for undefined or unknown room types
    }
  };

  const handleRoomDetailsChange = (index, field, value) => {
    const updatedRooms = [...roomsForSetup];
    updatedRooms[index][field] = value;
    setRoomsForSetup(updatedRooms);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsEditMode(false);
    setRoomNumber(room.room_number);
    setRoomType(room.RoomType);
    setPrice(room.price);
    setView(room.view);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price);
  };

  const handleEditRoom = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedRoom = {};
      let changeDetails = [];
  
      // Only add fields that have been changed
      if (roomNumber !== selectedRoom.room_number) {
        updatedRoom.new_room_number = roomNumber; // Update room number if changed
        changeDetails.push(`Room Number changed from ${selectedRoom.room_number} to ${roomNumber}`);
      }
      if (roomType !== selectedRoom.RoomType) {
        updatedRoom.RoomType = roomType; // Update room type if changed
        changeDetails.push(`Room Type changed from ${selectedRoom.RoomType} to ${roomType}`);
      }
      if (price !== selectedRoom.price) {
        updatedRoom.price = price; // Update price if changed
        changeDetails.push(`Price changed from ${formatPrice(selectedRoom.price)} to ${formatPrice(price)}`);
      }
      if (view !== selectedRoom.view) {
        updatedRoom.view = view; // Update view if changed
        changeDetails.push(`View changed from ${selectedRoom.view} to ${view}`);
      }
  
      // Check if there are any fields to update
      if (Object.keys(updatedRoom).length === 0) {
        Swal.fire('Info', 'No changes made to the room details.', 'info');
        return; // Exit if no changes were made
      }
  
      // Send the updated fields to the server
      await axios.put(`http://localhost:3001/api/roomsss/${selectedRoom.room_id}`, updatedRoom);
  
      // Log the changes with the current date and time
      const timestamp = new Date().toLocaleString();
      const changeDetailString = changeDetails.join(', ');
  
      // Create an object to store the change details, timestamp, and room ID
      const changeEntry = { roomId: selectedRoom.room_id, timestamp, details: changeDetailString };
  
      // Update the change history state for the specific room
      setChangeHistory(prevHistory => {
        const updatedHistory = {
          ...prevHistory,
          [selectedRoom.room_id]: [
            ...(prevHistory[selectedRoom.room_id] || []),
            changeEntry
          ]
        };
        // Save to local storage
        localStorage.setItem('changeHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
  
      Swal.fire('Success', 'Room updated successfully.', 'success');
      setIsEditMode(false);
      fetchBuildingDetails(); // Refresh data after edit
    } catch (error) {
      console.error('Error updating room:', error);
      Swal.fire('Error', 'There was an error updating the room. Please try again.', 'error');
    }
  };


  useEffect(() => {
    const storedChangeHistory = localStorage.getItem('changeHistory'); // Get the specific item
    if (storedChangeHistory) {
      try {
        setChangeHistory(JSON.parse(storedChangeHistory)); // Parse the JSON string
      } catch (error) {
        console.error('Error parsing change history:', error);
      }
    }
  }, []);
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    
    // Format the date
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    // Format the time
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // The hour '0' should be '12'
    
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${ampm}`;
    
    // Combine date and time
    return `${formattedDate}, ${formattedTime}`;
};

  
  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logout clicked');
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
  const navbarStyle = {
    background: '#CA3433',
    color: '#fff',
    fontSize: '1.5rem',
    position: 'fixed',
    padding: '8px',
    justifyContent: 'space-between',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    borderBottom: '1px solid #ccc'
};

  return (
    <div>
      <Navbar style={navbarStyle} expand="lg">
        <div className="d-flex align-items-center w-100">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faUser  } style={{ fontSize: '24px', marginRight: '11px' }} />
            <span>ADMINISTRATOR</span>
          </div>
        </div>
        <div className="ml-auto d-flex">
          <Link to="/dashboard/messages" style={{ color: '#fff', textDecoration: 'none', marginRight: '15px' }}>
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </Link>
        </div>
      </Navbar>
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
            <Link to="/dashboard/home" style={linkStyle}>
              <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', marginRight: '10px' }} />
              Home
            </Link>
            <Link to="/dashboard/users" style={linkStyle}>
              <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '20px', marginRight: '10px' }} />
              Users
            </Link>
            <Link to="/dashboard/availability" style={linkStyle}>
              <FontAwesomeIcon icon={faTable} style={{ fontSize: '20px', marginRight: '10px' }} />
              Availability
            </Link>
            <Link to="/dashboard/bldg" style={linkStyle}>
              <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '20px', marginRight: '10px' }} />
              Building
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

        <div className="dcontent" style={{ flex: 1, position: 'relative', marginLeft: '125px', padding: '20px', width: '1130px', }}>
          <Container fluid>
            {loading ? (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading...</p> {/* You can replace this with a skeleton loader */}
              </div>
            ) : error ? (
              <p>{error}</p>
            ) : building ? (
              <>
               <div className="details">
   <Card style={{ width: "350px", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)",marginLeft:'-169px',marginTop:'-30px' }}>
    <Card.Body>
      <h6 className="mb-2"><strong>Building Name:</strong> {building.bldg_name}</h6>
      <h6 className="mb-0"><strong>Location:</strong> {building.location}</h6>
    </Card.Body>
  </Card>
</div>

                {/* <div className="floors-list" style={{ marginTop: '1px' }}> */}
               
                  <Button className = 'add-floors button' onClick={() => setShowAddFloorsModal(true)} style={{ marginLeft: '39px', marginBottom: '-25px',height:'40px',padding:'10px' }}>
                    Add Floors
                  </Button>
                  
                  {/* Room Type Legend */}
                  <div style={{ marginBottom: '-90px', display: 'flex', alignItems: 'center', marginLeft:'385px',marginBottom: '1000px' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#ca3433', marginRight: '5px' }}></div>
                    <span>Studio</span>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', marginLeft: '15px', marginRight: '5px' }}></div>
                    <span>1 Br</span>
                    <div style={{ width: '20px', height: '20px', backgroundColor: '#007bff', marginLeft: '15px', marginRight: '5px' }}></div>
                    <span>2 Br</span>
                    <div style={{ width: '20px', height: '20px', backgroundColor: 'gray', marginLeft: '15px', marginRight: '5px' }}></div>
                    <span>Not Set Up</span>
                  </div>
                
                  {/* Add the table container */}
                  {/* <div className="building-detail-page" style={{ marginTop: '-950px'}}> */}

                    <Table className="custom-table" style={{ width: '1775px', minWidth: '300px', marginLeft: '-30px', height: '190px',marginTop:'-990px'}}>
                      <thead>
                        <tr>
                          <th style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>Floor</th>
                          <th style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1, width: '198px',height:'20px' }}>Rooms</th>
                        </tr>
                      </thead>
                      <tbody>
  {floors.length > 0 ? (
    floors.map((floor, index) => (
      <tr key={floor.floor_id}>
        <td>{`Floor ${index + 1}`}</td>
        <td>
          <Button
            variant="danger"
            onClick={() => handleAddRooms(floor.floor_id)}
            style={{ marginRight: '10px', marginTop: '10px' }}
          >
            Add Rooms
          </Button>
          <Button
            variant="danger"
            onClick={() => handleSetUpRooms(floor.floor_id)}
            style={{ marginTop: '10px' }}
          >
            Set Up Rooms
          </Button>
          <div className="room-tiles">
            {floor.rooms && floor.rooms.length > 0 ? (
              [...floor.rooms] // Create a new sorted array
              .sort((a, b) => a.room_number - b.room_number) // Sort in ascending order
              .map((room, index) => {
                // Ensure room_number is a string
                let roomNumber = room.room_number ? String(room.room_number) : '';

                // Extract the last part after the last '-'
                let displayRoomNumber = roomNumber.includes('-')
                  ? roomNumber.split('-').pop() // Gets only the number part after the last '-'
                  : roomNumber;

                return (
                  <div
                    key={index}
                    className={`room-tile ${room.isSetUp ? 'highlight' : ''} ${room.isSetUp ? 'blue-highlight' : ''}`}
                    onClick={() => handleRoomClick(room)}
                  >
                    <p>{displayRoomNumber || 'N/A'}</p> {/* Display cleaned room number */}
                    <p>{room.view || 'No View'}</p>
                    <span
                      className="room-type-dot"
                      style={{
                        backgroundColor: getRoomTypeColor(room.RoomType),
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <p>No rooms available for this floor.</p>
            )}
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="2">No floors available.</td>
    </tr>
  )}
</tbody>

                    </Table>
                  {/* </div> */}
                {/* </div> */}
              </>
            ) : (
              <p>Loading...</p>
            )}

            {/* Add Floors Modal */}
            <Modal show={showAddFloorsModal} onHide={() => setShowAddFloorsModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add Floors</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label>Enter the number of floors to add:</label>
                  <input
                    type="number"
                    value={numFloorsToAdd}
                    onChange={(e) => setNumFloorsToAdd(parseInt(e.target.value, 10))}
                    min="1"
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddFloorsModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleAddFloors}>
                  Add Floors
                </Button>
              </Modal.Footer>
            </Modal>

           
            {/* Room Details Modal */}
            <Modal show={selectedRoom !== null} onHide={() => setSelectedRoom(null)}>
            <Modal.Header closeButton>
  <Modal.Title style={{ display: 'flex', alignItems: 'center' }}>
    Edit Room Details
    <button
  style={{
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px',
  }}
  onClick={() => {
    setShowChangeHistoryModal(true); // Open the change history modal
  }}
>
  <FontAwesomeIcon icon={faClipboard} />
</button>
  </Modal.Title>
</Modal.Header>
              <Modal.Body>
  {selectedRoom && (
    <div>
      <img
        src={getRoomImage(selectedRoom.RoomType)}
        alt={`${selectedRoom.RoomType} Room`}
        style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
      />
      <p>
        <strong>Room Number:</strong>{" "}
        {isEditMode ? (
          <input
            type="number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        ) : (
          selectedRoom.room_number
        )}
      </p>
      <p>
        <strong>Room Type:</strong>{" "}
        {isEditMode ? (
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Studio">Studio</option>
            <option value="1Br">1 Br</option>
            <option value="2Br">2 Br</option>
          </select>
        ) : (
          selectedRoom.RoomType
        )}
      </p>
      <p>
        <strong>Room View:</strong>{" "}
        {isEditMode ? (
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Nature View">Nature View</option>
            <option value="Amenity View">Amenity View</option>
          </select>
        ) : (
          selectedRoom.view
        )}
      </p>
      <p>
        <strong>Price:</strong>{" "}
        {isEditMode ? (
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value, 10))}
            min="1"
            style={{ width: "100%", padding: "8px" }}
          />
        ) : (
          formatPrice(selectedRoom.price)
        )}
      </p>
    </div>
  )}
</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setSelectedRoom(null)}>
                  Close
                </Button>
                {isEditMode ? (
                  <Button variant="primary" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleEditRoom}>
                    Edit
                  </Button>
                )}
              </Modal.Footer>
            </Modal>

           
           
           
           
           
            <Modal 
  show={showChangeHistoryModal} 
  onHide={() => setShowChangeHistoryModal(false)} 
  style={{ maxWidth: '800px', width: '100%' }} // Set the modal width
>
  <Modal.Header closeButton>
    <Modal.Title>Change History for Room {selectedRoom?.room_number}</Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ padding: '20px' }}>
    <div style={{ marginBottom: '20px' }}>
      <Table striped bordered hover style={{ marginTop: '0', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: '#f8f9fa', color: '#333', fontSize: '11px', width: '30%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',width:'60%' }}>Date/Time</th>
            <th style={{ backgroundColor: '#f8f9fa', color: '#333', fontSize: '11px', width: '70%', wordWrap: 'break-word' }}>Change Details</th>
          </tr>
        </thead>
        <tbody>
          {changeHistory[selectedRoom?.room_id]?.length > 0 ? (
            changeHistory[selectedRoom.room_id].map((change, index) => (
              <tr key={index}>
                <td style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',  }}>
                  {formatTimestamp(change.timestamp)} {/* Format the timestamp */}
                </td>
                <td style={{ fontSize: '10px', wordWrap: 'break-word' }}>{change.details}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No changes recorded for this room.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowChangeHistoryModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
            {/* Add Rooms Modal */}
            <Modal show={showAddRoomsModal} onHide={() => setShowAddRoomsModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Adding Rooms to this Floor</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label>Enter the number of rooms to add:</label>
                  <input
                    type="number"
                    value={numRooms}
                    onChange={(e) => setNumRooms(parseInt(e.target.value, 10))}
                    min="1"
                    style={{ width: '100%', padding: '8px' }}
                  />
                  <p style={{ marginTop: '10px' }}>
                    <strong>Rooms to be added: {numRooms}</strong>
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddRoomsModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmitAddRooms}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Setup Rooms Modal */}
            <Modal show={showSetupRoomsModal} onHide={() => setShowSetupRoomsModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Setup Rooms</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label>Number of Rooms to Setup:</label>
                  <input
                    type="number"
                    value={numRoomsToSetup}
                    onChange={(e) => setNumRoomsToSetup(Math.min(e.target.value, availableRooms))}
                    min="1"
                    max={availableRooms}
                    style={{ width: '100%', padding: '8px' }}
                  />
                  <p>Available Rooms To Set Up: {availableRooms}</p>
                </div>

                {numRoomsToSetup > 0 && (
                  <div>
                    <h5>Room Details for {numRoomsToSetup} Rooms</h5>
                    <div>
                      <label>Room Type:</label>
                      <select
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                      >
                        <option value="Studio">Studio</option>
                        <option value="1Br">1 Bedroom</option>
                        <option value="2Br">2 Bedrooms</option>
                      </select>
                    </div>
                    <div>
                      <label>Price:</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                        min="1"
                        style={{ width: '100%', padding: '8px' }}
                      />
                    </div>
                    <div>
                      <label>View:</label>
                      <select
                        value={view}
                        onChange={(e) => setView(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                      >
                        <option value="Nature View">Nature View</option>
                        <option value="Amenity View">Amenity View</option>
                      </select>
                    </div>  
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSetupRoomsModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSubmitSetupRooms}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default BuildingDetail;