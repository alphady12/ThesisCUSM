import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

const Condos = () => {
  const [condos, setCondos] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: 0,
    number_of_bedrooms: 0,
    amenities: '',
    price_per_night: 0,
    price_for_sale: 0,
    availability: 'available',
    editingCondoId: null
  });
  const [selectedCondo, setSelectedCondo] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    fetchCondos();
  }, []);

  const fetchCondos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/condominuims');
      setCondos(response.data);
    } catch (error) {
      console.error('Error fetching condos:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.editingCondoId) {
        await axios.put(`http://localhost:3001/api/condominuims/${formData.editingCondoId}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/condominuims', formData);
      }
      setFormData({
        name: '',
        description: '',
        size: 0,
        number_of_bedrooms: 0,
        amenities: '',
        price_per_night: 0,
        price_for_sale: 0,
        availability: 'available',
        editingCondoId: null
      });
      fetchCondos();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding/updating condo:', error.response ? error.response.data : 'Internal Server Error');
    }
  };

  const deleteCondo = async (condoId) => {
    try {
      await axios.delete(`http://localhost:3001/api/condominuims/${condoId}`);
      fetchCondos();
    } catch (error) {
      console.error('Error deleting condo:', error);
    }
  };
 

  const handleEditClick = (condo) => {
    setFormData({
      ...formData,
      name: condo.name,
      description: condo.description,
      size: condo.size,
      number_of_bedrooms: condo.number_of_bedrooms,
      amenities: condo.amenities,
      price_per_night: condo.price_per_night,
      price_for_sale: condo.price_for_sale,
      availability: condo.availability,
      editingCondoId: condo.condo_id
    });
    setShowModal(true);
  };

  const handleReadClick = (condo) => {
    setSelectedCondo(condo);
    handleRead(condo);
  };

  const handleRead = (condo) => {
    // You can implement how to display the details of the condo here
    console.log('Reading condo:', condo);
    // Example: Display details in an alert
    alert(`Condo Details:\nName: ${condo.name}\nDescription: ${condo.description}\nSize: ${condo.size}\nNumber of Bedrooms: ${condo.number_of_bedrooms}\nAmenities: ${condo.amenities}\nPrice Per Night: ${condo.price_per_night}\nPrice For Sale: ${condo.price_for_sale}\nAvailability: ${condo.availability}`);
    // If you want to show details in a modal instead of alert, uncomment the line below
    // setShowModal(true);
  };

  return (
    <div className="container">
      <h1 className="text-center">Condos Management</h1>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2>Add New Condo</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formName">
              <Form.Label column sm="2">Name:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formDescription">
              <Form.Label column sm="2">Description:</Form.Label>
              <Col sm="10">
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formSize">
              <Form.Label column sm="2">Size:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="size" value={formData.size} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formNumberOfBedrooms">
              <Form.Label column sm="2">Number of Bedrooms:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="number_of_bedrooms" value={formData.number_of_bedrooms} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formAmenities">
              <Form.Label column sm="2">Amenities:</Form.Label>
              <Col sm="10">
                <Form.Control as="textarea" name="amenities" value={formData.amenities} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPricePerNight">
              <Form.Label column sm="2">Price Per Night:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="price_per_night" value={formData.price_per_night} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPriceForSale">
              <Form.Label column sm="2">Price For Sale:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="price_for_sale" value={formData.price_for_sale} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formAvailability">
              <Form.Label column sm="2">Availability:</Form.Label>
              <Col sm="10">
                <Form.Control as="select" name="availability" value={formData.availability} onChange={handleChange} required>
                  <option value="available">Available</option>
                  <option value="reserve ">Reserve</option>
                  <option value="sold">Sold</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">
              {formData.editingCondoId ? 'Update Condo' : 'Add Condo'}
            </Button>
          </Form>
        </div>
      </div>

      <h2 className="text-center mt-4">Existing Condos</h2>
      <Table striped bordered hover style={{ marginLeft: '50px', marginTop: '50px' }}> 
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Size</th>
            <th>Number of Bedrooms</th>
            <th>Amenities</th>
            <th>Price Per Night</th>
            <th>Price For Sale</th>
            <th>Availability</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {condos.map(condo => (
            <tr key={condo.condo_id}>
              <td>{condo.name}</td>
              <td>{condo.description}</td>
              <td>{condo.size}</td>
              <td>{condo.number_of_bedrooms}</td>
              <td>{condo.amenities}</td>
              <td>{condo.price_per_night}</td>
              <td>{condo.price_for_sale}</td>
              <td>{condo.availability}</td>
              <td>
                <div className="btn-group">
                  <Button variant="info" onClick={() => handleReadClick(condo)} className="mr-2">Read</Button>
                  <Button variant="warning" onClick={() => handleEditClick(condo)} className="mr-2">Update</Button>
                  <Button variant="danger" onClick={() => deleteCondo(condo.condo_id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for displaying condo details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.editingCondoId ? 'Edit Condo' : 'Condo Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formModalName">
              <Form.Label column sm="2">Name:</Form.Label>
              <Col sm="10">
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalDescription">
              <Form.Label column sm="2">Description:</Form.Label>
              <Col sm="10">
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalSize">
              <Form.Label column sm="2">Size:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="size" value={formData.size} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalNumberOfBedrooms">
              <Form.Label column sm="2">Number of Bedrooms:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="number_of_bedrooms" value={formData.number_of_bedrooms} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalAmenities">
              <Form.Label column sm="2">Amenities:</Form.Label>
              <Col sm="10">
                <Form.Control as="textarea" name="amenities" value={formData.amenities} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalPricePerNight">
              <Form.Label column sm="2">Price Per Night:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="price_per_night" value={formData.price_per_night} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalPriceForSale">
              <Form.Label column sm="2">Price For Sale:</Form.Label>
              <Col sm="10">
                <Form.Control type="number" name="price_for_sale" value={formData.price_for_sale} onChange={handleChange} required />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formModalAvailability">
              <Form.Label column sm="2">Availability:</Form.Label>
              <Col sm="10">
                <Form.Control as="select" name="availability" value={formData.availability} onChange={handleChange} required>
                  <option value="available">Available</option>
                  <option value="reserve">Reserve</option>
                  <option value="sold">Sold</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">
              {formData.editingCondoId ? 'Update Condo' : 'Add Condo'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Condos;