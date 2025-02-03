import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useTable } from 'react-table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import { TiTick } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import './bldg.css';
import Swal from 'sweetalert2';

const Stepper = ({ currentStep, setCurrentStep, complete }) => {
  const steps = ['Add Building', 'Add Floors', 'Add Rooms', 'Add Room Types'];
  return (
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`stepper-item ${
              currentStep === i + 1 ? 'active' : ''
            } ${i + 1 < currentStep || complete ? 'complete' : ''}`}
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

const AdminBldg = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [formData, setFormData] = useState({
    bldg_name: '',
    location: '',
    number_of_floors: 0,
    editingBuildingId: null,
  });
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const fetchBuildings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/buildingssssss');
      setBuildings(response.data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      Swal.fire('Error', 'Failed to fetch buildings. Please try again.', 'error');
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveBuilding = async (e) => {
    e.preventDefault();
    const { bldg_name, location, number_of_floors } = formData;

    if (number_of_floors <= 0) {
      alert('Number of floors must be greater than zero.');
      return;
    }

    const buildingData = {
      bldg_name,
      location,
      number_of_floors,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/buildingss', buildingData);
      const newBuilding = response.data;

      setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);

      setFormData({
        bldg_name: '',
        location: '',
        number_of_floors: 0,
      });
      setShowBuildingModal(false);
      setCurrentStep(2);
      navigate(`/building/${newBuilding.bldg_id}`);
    } catch (error) {
      console.error('Error creating building:', error);
      Swal.fire('Error', 'There was an issue creating the building.', 'error');
    }
  };

  const handleBuildingClick = (building) => {
    if (building && building.bldg_id) {
      navigate(`/building/${building.bldg_id}`);
    } else {
      Swal.fire('Error', 'Invalid building ID.', 'error');
    }
  };

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

  const columns = useMemo(
    () => [
      {
        Header: 'Building Name',
        accessor: 'bldg_name',
        Cell: ({ row }) => (
          <Button variant="link" onClick={() => handleBuildingClick(row.original)}>
            {row.values.bldg_name}
          </Button>
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
          <span
            style={{
              color: 'lightgrey',
              cursor: 'pointer',
              textDecoration: 'underline',
              transition: 'color 0.3s, font-weight 0.2s',
              marginRight: '100px',
            }}
            onClick={() => handleDelete(row.original.bldg_id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.fontWeight = 'bold';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'lightgrey';
              e.currentTarget.style.fontWeight = 'normal';
            }}
          >
            Delete
          </span>
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
  } = useTable({ columns, data: buildings });

  return (
    <Container>
      <div className="top-container">
        <Button
          onClick={() => {
            setShowBuildingModal(true);
            setFormData({
              bldg_name: '',
              location: '',
              number_of_floors: 0,
            });
            setCurrentStep(1);
          }}
          className="add-building-btn"
        >
          + Add Building
        </Button>
      </div>

      <Modal show={showBuildingModal} onHide={() => setShowBuildingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{formData.editingBuildingId ? 'Edit Building' : 'Add Building'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} complete={false} />
          <Form onSubmit={handleSaveBuilding}>
            {currentStep === 1 && (
              <>
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
                  <Form.Label >Location</Form.Label>
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
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} key={column.id} style={{ width: column.id === 'bldg_name' ? '50%' : '25%' }}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
};

export default AdminBldg;