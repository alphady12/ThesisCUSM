import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

const AdminRoomSize = () => {
  const [roomSizes, setRoomSizes] = useState([]);
  const [formData, setFormData] = useState({
    size: '',
    description: ''
  });

  useEffect(() => {
    fetchRoomSizes();
  }, []);

  const fetchRoomSizes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/size');
      setRoomSizes(response.data);
    } catch (error) {
      console.error('Error fetching room sizes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/size', formData);
      setFormData({
        size: '',
        description: ''
      });
      fetchRoomSizes();
    } catch (error) {
      console.error('Error adding room size:', error.response ? error.response.data : 'Internal Server Error');
    }
  };

  const deleteRoomSize = async (sizeId) => {
    try {
      await axios.delete(`http://localhost:3001/api/size/${sizeId}`);
      fetchRoomSizes();
    } catch (error) {
      console.error('Error deleting room size:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="text-center">Room Sizes Management</h1>

          <h2>Add New Room Size</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSize">
              <Form.Label>Size:</Form.Label>
              <Form.Control type="text" name="size" value={formData.size} onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>

            <Button type="submit">Add Room Size</Button>
          </Form>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-10">
          <h2>Existing Room Sizes</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Size</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {roomSizes.map(roomSize => (
                <tr key={roomSize.size_id}>
                  <td>{roomSize.size}</td>
                  <td>{roomSize.description}</td>
                  <td>
                    <Button onClick={() => deleteRoomSize(roomSize.size_id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminRoomSize;