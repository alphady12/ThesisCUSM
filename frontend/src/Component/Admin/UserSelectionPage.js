import React from 'react';
import { Link } from 'react-router-dom';
import './LoginOption.css'; // Import your CSS file

const UserSelectionPage = () => {
  return (
    <div className="LoginOption-container">
      <h2>FUTURA MONTE NAGA</h2>
      <div className="LoginOption-group">
        <Link to="/login" className="btn btn-success">Admin</Link>
        <Link to="/managerlogin" className="btn btn-success">Manager</Link>
        <Link to="/agentlogin" className="btn btn-success">Agent</Link>
      </div>
    </div>
  );
};

export default UserSelectionPage;