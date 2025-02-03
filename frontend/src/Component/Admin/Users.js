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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_name: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/users', formData);
      setFormData({
        name: '',
        email: '',
        role_name: '',
        password: '',
      });
      fetchUsers();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding user:', error.response ? error.response.data : 'Internal Server Error');
    }
  };

  const deleteUser  = async (userId) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (isConfirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/users/${userId}`);
        fetchUsers();
        Swal.fire('Deleted!', 'User  has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser (user);
    setFormData(user);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser (null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/users/${selectedUser .user_id}`, formData);
      fetchUsers();
      setShowModal(false);
      setSelectedUser (null);
      Swal.fire('Updated!', 'User  has been updated.', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire('Error!', 'There was a problem updating the user.', 'error');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container move-up users-scroll-container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="text-center">User  Management</h1>
          <div className="search-bar">
            <InputGroup className="search-group">
              <FormControl
                type="search"
                placeholder="Search by Name"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
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

          {/* Add User Modal */}
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="user-modal">
            <Modal.Header closeButton>
              <Modal.Title>New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddSubmit}>
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
                <Form.Group controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role_name"
                    value={formData.role_name}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </Form.Control>
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

          {/* Users Table */}
          <Table striped bordered hover className="users-table-margin-left">
            <thead>
              <tr>
              <th style={{ width: '129px', padding: '10px', backgroundColor: '#ca3433', color: 'white', fontWeight: 'bold' }}>Name</th>
      <th style={{ width: '180px', padding: '10px', backgroundColor: '#ca3433', color: 'white', fontWeight: 'bold' }}>Email</th>
      <th style={{ width: '90px', padding: '10px', backgroundColor: '#ca3433', color: 'white', fontWeight: 'bold' }}>Roles</th>
      <th style={{ width: '75px', padding: '10px', backgroundColor: '#ca3433', color: 'white', fontWeight: 'bold' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.user_id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role_name}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '9px' }}>
                      <Button
                        variant="primary"
                        onClick={() => handleEdit(user)}
                        className="edit-btn"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteUser (user.user_id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Edit User Modal */}
          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleModalSubmit}>
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
                <Form.Group controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role_name"
                    value={formData.role_name}
                    onChange={handleChange}
                    required
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </Form.Control>
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

export default Users;