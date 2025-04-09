import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useTable } from 'react-table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import { TiTick } from 'react-icons/ti';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './bldg.css';

// Stepper Component
const Stepper = ({ currentStep, complete }) => {
  const steps = ['Add Building', 'Add Floors', 'Add Rooms', 'Add Room Types'];
  return (
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`stepper-item ${currentStep === i + 1 ? 'active' : ''} ${i + 1 < currentStep || complete ? 'complete' : ''}`}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TableContainers = styled.div`
  border: 1px solid rgb(20, 20, 20);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0; /* Margin for spacing */
  width: 1560px; /* Full width */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 25px; /* Inner spacing */
  position: relative;
  top: -20px;
  height: 496px; /* Set a fixed height for the table container */
  overflow-y: auto; /* Enable vertical scrolling */
  left:100px;
`;

const ManagementContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* Space below the management container */
`;

const ManagementCheckbox = styled(Form.Check)`
  margin-right: 10px; /* Space between checkbox and label */
`;

const StyledTable = styled.table`
  width: 105%; /* Full width */
  border-collapse: collapse;
  font-size: 0.9em;
  font-family: verdana;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  table-layout:fixed;
`;

const OuterContainer = styled.div`
  border: 1px solid black;
  width: 415px;
  height: 413px;
  position: relative;
 margin: 0;  /* Changed from margin: 0 auto */
  margin-left: 20px;  /* Adjust this 
`;


const TableHeader = styled.th`
  background-color: rgb(252, 35, 28);
  color: #ffffff;
  text-align: left;
  padding: 11px 14px;
  font-weight: 200;
`;

const TableCell = styled.td`
  padding: 10px 11px;
  border-bottom: 1px solid #dddddd;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #dddddd;
  
  &:nth-of-type(even) {
    background-color: #f3f3f3;
  }
  
  &:last-of-type {
    border-bottom: 1px solid #009879;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const DeleteButton = styled.span`
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff4757;
    font-weight: 500;
  }
`;


const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligns the search bar to the right */
  margin-bottom: 20px; /* Space below the search bar */
  margin: 20, 0px;
  margin-right: 10px;
  width: 200px;

`;


const SearchBarContainer = styled.div`
  margin-bottom: 680px; /* Space below the search bar */

`;

const BuildingLink = styled(Button)`
  color: #009879;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #007d63;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-start; /* Align buttons to the left */
  margin-top: 50px; /* Add some space above the action container */
  margin-bottom: 20px; /* Space below the action container */
  border-radius: 10px; /* Corrected property */
  border: 1px solid rgb(20, 20, 20); /* Add a border */
  padding: 10px; /* Optional: Add some padding for better spacing */
  margin-left: 0; /* Reset margin-left to 0 */
  position: relative; /* Optional: Use relative positioning if needed */
  gap: 10px; /* Set the gap between buttons */
`;

const ActionButton = styled(Button)`
  width: 40px; /* Set a fixed width */
  height: 40px; /* Set a fixed height */
  border-radius: 5px; /* Rounded corners */
  padding: 0; /* Remove padding */
  display: flex; /* Use flex to center the icon */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
`;

const PlusButton = styled(ActionButton)`
  background-color:rgb(31, 32, 31); /* Green background for plus button */
  border: none; /* Remove border */
  
  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
`;

const TrashButton = styled(ActionButton)`
  background-color: #dc3545; /* Red background for trash button */
  border: none; /* Remove border */
  
  &:hover {
    background-color: #c82333; /* Darker red on hover */
  }
`;

// Main Component
const AdminBldg = () => {
  const [buildings, setBuildings] = useState([]);
  const [formData, setFormData] = useState({
    bldg_name: '',
    location: '',
    number_of_floors: 0,
  });
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();

  // Fetch buildings from API
  const fetchBuildings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/all-buildings');
      setBuildings(response.data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      Swal.fire('Error', 'Failed to fetch buildings. Please try again.', 'error');
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle saving a new building
  const handleSaveBuilding = async (e) => {
    e.preventDefault();
    const { bldg_name, location, number_of_floors } = formData;

    if (number_of_floors <= 0) {
      alert('Number of floors must be greater than zero.');
      return;
    }

    const buildingData = { bldg_name, location, number_of_floors };

    try {
      const response = await axios.post('http://localhost:3001/api/buildingss', buildingData);
      const newBuilding = response.data;

      setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);
      setFormData({ bldg_name: '', location: '', number_of_floors: 0 });
      setShowBuildingModal(false);
      setCurrentStep(2);
      navigate(`/building/${newBuilding.bldg_id}`);
    } catch (error) {
      console.error('Error creating building:', error);
      Swal.fire('Error', 'There was an issue creating the building.', 'error');
    }
  };
// Handle building row click
const handleBuildingClick = async (building) => {
  if (building && building.bldg_id) {
    try {
      // Generate a token for the building ID
      const response = await axios.get(`http://localhost:3001/api/building-token/${building.bldg_id}`);
      const token = response.data.token; // Get the token from the response
      navigate(`/building/${token}`); // Navigate using the token
    } catch (error) {
      console.error('Error generating token:', error);
      Swal.fire('Error', 'Could not navigate to building details.', 'error');
    }
  } else {
    Swal.fire('Error', 'Invalid building ID.', 'error');
  }
};
  // Handle building deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this building and all associated rooms?')) {
      try {
        await axios.delete(`http://localhost:3001/api/rooms?bldg_id=${id}`);
        await axios.delete(`http://localhost:3001/api/buildings/${id}`);
        fetchBuildings();
      } catch (error) {
        console.error('Error deleting building or associated rooms:', error);
      }
    }
  };

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: 'Building Name',
        accessor: 'bldg_name',
        Cell: ({ row }) => (
          <BuildingLink variant="link" onClick={() => handleBuildingClick(row.original)}>
            {row.values.bldg_name}
          </BuildingLink>
        ),
      },
      {
        Header: 'Number of Floors',
        accessor: 'number_of_floors',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <DeleteButton onClick={() => handleDelete(row.original.bldg_id)}>
            Delete
          </DeleteButton>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: buildings || [] });

  return (
    <Container>
      <div className="top-container">
        <Button
          onClick={() => {
            setShowBuildingModal(true);
            setFormData({ bldg_name: '', location: '', number_of_floors: 0 });
            setCurrentStep(1);
          }}
          className="add-building-btns"
        >
          + Add Building
        </Button>
      </div>

      <Modal show={showBuildingModal} onHide={() => setShowBuildingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{formData.editingBuildingId ? 'Edit Building' : 'Add Building'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stepper currentStep={currentStep} complete={false} />
          <Form onSubmit={handleSaveBuilding}>
            <Form.Group controlId="bldg_name">
              <Form.Label>Building Name</Form.Label>
              <Form.Control
                type="text"
                name="bldg_name"
                value={formData.bldg_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="number_of_floors">
              <Form.Label>Number of Floors</Form.Label>
              <Form.Control
                type="number"
                name="number_of_floors"
                value={formData.number_of_floors}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <SearchBarContainer>
      <SearchBarWrapper>
        <div style={{ position: 'relative' }}>
          <Form.Control
            type="text"
            placeholder="Search Buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingRight: '30px' }} // Add padding to avoid overlap with the icon
          />
          <span style={{
            position: 'absolute',
            right: '20px', // Position the icon on the right
            top: '40%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none' // Prevents the icon from capturing mouse events
          }}>
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </SearchBarWrapper>
    </SearchBarContainer>
      
      
      
    <OuterContainer> 
    
    
    </OuterContainer>  


      <TableContainers>
        <ManagementContainer>
          <ManagementCheckbox type="checkbox" id="buildingManagement" />
          <Form.Label htmlFor="buildingManagement">Building Management</Form.Label>
        </ManagementContainer>

        <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '12px' }}>Buildings</h2>
       
        {/* New Action Container with Plus and Trash Buttons */}
        <ActionContainer style={{ marginBottom: '20px' }}>
          <PlusButton onClick={() => {
            setShowBuildingModal(true);
            setFormData({ bldg_name: '', location: '', number_of_floors: 0 });
            setCurrentStep(1);
          }}>
            +
          </PlusButton>
          <TrashButton onClick={() => {
            // Add your logic for deleting selected buildings or items
            Swal.fire('Delete', 'Delete functionality not implemented yet.', 'info');
          }}>
            🗑️
          </TrashButton>
        </ActionContainer>
       
        <StyledTable {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableHeader {...column.getHeaderProps()}>{column.render('Header')}</TableHeader>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </tbody>
        </StyledTable>
      </TableContainers>

    </Container>
  );
};

export default AdminBldg;