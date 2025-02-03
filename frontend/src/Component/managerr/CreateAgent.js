import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { PlusCircle, Pencil } from 'react-bootstrap-icons';
import { FaTrash } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FormControl, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './User.css';


const CreateAgent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_name: 'Agent',
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // Fetch users only with 'Agent' role
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users');
      const filteredUsers = response.data.filter(user => user.role_name === 'Agent');
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users', formData);
      Swal.fire('Success!', 'Agent has been added successfully.', 'success');
      setFormData({ name: '', email: '', password: '', role_name: 'Agent' });
      setShowAddModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      Swal.fire('Error!', 'There was an error adding the agent.', 'error');
    }
  };


  const deleteUser = async (userId) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });


    if (isConfirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/users/${userId}`);
        fetchUsers();
        Swal.fire('Deleted!', 'Agent has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
      }
    }
  };


  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role_name: user.role_name,
    });
    setShowModal(true);
  };


  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        password: formData.password || undefined,
      };
      await axios.put(`http://localhost:3001/api/users/${selectedUser.id}`, updatedData);
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
      Swal.fire('Updated!', 'User has been updated.', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire('Error!', 'There was a problem updating the user.', 'error');
    }
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const filteredUsers = users.filter(user =>
    user.role_name === 'Agent' && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="text-center">Agent Management</h1>
          <div className="search-bar">
            <InputGroup className="search-group">
              <FormControl
                type="search"
                placeholder="Search by Name"
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="add-btn"
            >
              <PlusCircle />
            </Button>
          </div>
          <Table striped bordered hover className="user-table mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role_name}</td>
                  <td>
                  <Button
                        variant="primary"
                        onClick={() => handleEdit(user)}
                        className="edit-btn"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteUser(user.id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>


          {/* Add User Modal */}
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="user-modal">
            <Modal.Header closeButton>
              <Modal.Title>New Agent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddUser}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>


                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>


                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>


                <Button variant="primary" type="submit" className="mt-3">
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>


          {/* Edit User Modal */}
          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Agent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                  Save Changes
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};


export default CreateAgent;



