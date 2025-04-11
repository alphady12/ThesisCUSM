import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.css';


import Login from './Component/Admin/Login';
import Dashboard from './Component/Admin/Dashboard';
import CustomerDashboard from './Component/Customer/CustomerDashboard';
import Home from './Component/Customer/Home';
import FloorRoomForm from './Component/Admin/FloorRoomForm';
import RegistrationForm from './Component/Admin/Createuser';

import HHome from './Component/Admin/AdminHome';
import Users from './Component/Admin/UserSelectionPage';
import Buildinginfo from './Component/Admin/Buildinginfo'; // Import the Buildinginfo component
import ManagerLogin from './Component/managerr/ManagerLogin';
import ManagerDashboard from './Component/managerr/ManagerDashboard';
import AgentLogin from './Component/Agent/AgentLogin';
import AgentDashboard from './Component/Agent/AgentDashboard';


const App = () => {
  return (
    <Router>
     
      <Container>
        <Row>
          <Col md={12}>
            <Routes>

            <Route path="customer/home" element={<Home />} />
              <Route path="/" element={<Users />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegistrationForm />} /> 
              <Route path="/dashboard/*" element={<Dashboard/>} />
              <Route path="/dashboard2/*" element={<CustomerDashboard/>} />
              <Route path="/FloorRoomForm/*" element={<FloorRoomForm/>} />
              <Route path="/building/:id" element={<Buildinginfo />} /> 

              <Route path="/home" element={<HHome />} />
              <Route path="/managerlogin" element={<ManagerLogin />} />
              <Route path="/manager/*" element={<ManagerDashboard />} />
              <Route path="/agent/*" element={<AgentDashboard />} />
              <Route path="/agentlogin" element={<AgentLogin/>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
};


export default App;