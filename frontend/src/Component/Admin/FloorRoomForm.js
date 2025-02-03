import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Modal, Table } from 'react-bootstrap';
import './jsx.css';

const FloorForm = ({ buildingId }) => {
  const [formData, setFormData] = useState({
    number_of_floors: '',
    location: '',
  });
  const [floors, setFloors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchFloors();
  }, [buildingId]);

  const fetchFloors = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/floor');
      setFloors(response.data);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/floor', formData);
      setFormData({
        number_of_floors: '',
        location: '',
      });
      fetchFloors();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding floor:', error);
    }
  };

  const handleDeleteFloor = async (floorId) => {
    try {
      await axios.delete(`http://localhost:3001/api/floor/${floorId}`);
      fetchFloors();
    } catch (error) {
      console.error('Error deleting floor:', error);
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-between align-items-center py-3 header-row sticky-top">
        <Col>
          <h1>Building Floor Plan</h1>
        </Col>
        <Col className="text-end">
          <div 
            className="circle-button" 
            onClick={() => setShowAddModal(true)}
          >
            <div className="plus-icon">+</div>
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center">
        {floors.map((floor, index) => (
          <Col md={8} key={index}>
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="btn-group" role="group">
                  <Button variant="danger" onClick={() => handleDeleteFloor(floor.floor_id)}>Delete</Button>
                </div>
              </div>
              <div className="card-body">
                <Table bordered className="floor-plan-table">
                  <thead>
                    <tr>
                      <th>Floor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: floor.number_of_floors }, (_, i) => (
                      <tr key={i} className="floor-row">
                        <td>
                          Floor {floor.number_of_floors - i}
                          <div className="floor-location">
                            {floor.location}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="custom-modal-title">Add New Floor</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNumberOfFloors" className="custom-form-group">
              <Form.Label>How many Floors:</Form.Label>
              <Form.Control
                type="number"
                name="number_of_floors"
                value={formData.number_of_floors}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="custom-form-group">
              <Form.Label>Building Name:</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button
              variant="danger"
              type="submit"
              className="custom-submit-button rounded-pill"
            >
              DONE
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FloorForm;