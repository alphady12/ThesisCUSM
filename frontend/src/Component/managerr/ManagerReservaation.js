import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Swal from "sweetalert2";
import { Container, Nav } from "react-bootstrap";
import { Link, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressCard, faBuilding, faCalendarAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './mreservation.css'; 

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [agents, setAgents] = useState([]);
  const [loadingIds, setLoadingIds] = useState(new Set()); // Use a Set to track loading states

  useEffect(() => {
    fetchReservations();
    fetchAgents();
    const intervalId = setInterval(fetchReservations, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/reservationss");
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/agents");
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const updateReservationStatus = async (reservation_id, status) => {
    if (loadingIds.has(reservation_id)) return; // Prevent duplicate requests for the same reservation
    setLoadingIds((prev) => new Set(prev).add(reservation_id)); // Add reservation_id to loadingIds

    const confirmText = status === "Reserved" ? "confirm" : "cancel";
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you really want to ${confirmText} this reservation?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${confirmText} it!`,
      cancelButtonText: "No, go back",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:3001/api/reservations/${reservation_id}/status`, {
          status,
        });

        // Instead of fetching reservations again, we can update the state directly
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.reservation_id === reservation_id
              ? { ...reservation, status }
              : reservation
          )
        );

        Swal.fire(`${status}!`, `Reservation status updated to ${status}.`, "success");
      } catch (error) {
        console.error(`Error updating reservation:`, error);
        Swal.fire("Error!", `There was a problem updating the reservation.`, "error");
      }
    }

    setLoadingIds((prev) => {
      const newIds = new Set(prev);
      newIds.delete(reservation_id); // Remove reservation_id from loadingIds
      return newIds;
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getAgentName = (agentId) => {
    const agent = agents.find((agent) => agent.user_id === agentId);
    return agent ? agent.name : "Unknown Agent";
  };

  const filteredReservations = reservations.filter(
    (reservation) =>
      (filter === "All" || reservation.status === filter) &&
      reservation.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
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
          <Link to="/manager/home" style={linkStyle}>
            <FontAwesomeIcon icon={faHome} style={{ fontSize: '20px', marginRight: '10px' }} />
            Home
          </Link>
          <Link to="/manager/agentusers" style={linkStyle}>
            <FontAwesomeIcon icon={faAddressCard} style={{ fontSize: '20px', marginRight: '10px' }} />
            Agents
          </Link>
          <Link to="/manager/bldg" style={linkStyle}>
            <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '20px', marginRight: '10px' }} />
            Building
          </Link>
          <Link to="/manager/Reservations" style={linkStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '20px', marginRight: '10px' }} />
            Reservations
          </Link>
          <Nav.Link
            onClick={() => console.log("Logout")} // Implement your logout logic here
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

      <div className="content" style={{ flex: 1, position: 'relative', marginLeft: '180px' }}>
        <Container fluid>
          <div className="mcontainer">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <h1 className="text-center mt-4">Reservation Details</h1>

                <div className="search-bar mb-3">
                  <InputGroup>
                    <FormControl
                      type="search"
                      placeholder="Search by Name"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </InputGroup>
                </div>

                <div className="d-flex justify-content-start mb-3">
                  {["All", "Pending", "Reserved", "Cancelled"].map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? "primary" : "outline-primary"}
                      className="me-2"
                      onClick={() => setFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>

                <div className="table-containers"> {/* Add a container for the table */}
                  <Table striped bordered hover className="reservation-table mt-2">
                    <thead>
                      <tr>
                      <th style={{ width: '122px' }}>Agent Name</th>
                       <th style={{ width: '140px' }}> Name</th>
                        <th style={{ width: '140px' }}>Phone Number</th>
                         <th style={{ width: '170px' }}>Email</th>
                          <th style={{ width: '110px' }}>Room Number</th>
                          <th style={{ width: '110px' }}>Room Type</th>
                           <th style={{ width: '100px' }}>Status</th>
                           <th style={{ width: '118px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.reservation_id}>
                          <td>{getAgentName(reservation.agent_id)}</td>
                          <td>{reservation.Name}</td>
                          <td>{reservation.phone_number}</td>
                          <td>{reservation.email}</td>
                          <td>{reservation.Room_number}</td>
                          <td>{reservation.Room_Type}</td>
                          <td>{reservation.status}</td>
                          <td>
                            <Button
                              variant="success"
                              onClick={() => updateReservationStatus(reservation.reservation_id, "Reserved")}
                              style={{ width: "100px" }}
                              disabled={loadingIds.has(reservation.reservation_id) || reservation.status === "Cancelled"}
                            >
                              Confirm
                            </Button>{" "}
                            <Button
                              variant="danger"
                              onClick={() => updateReservationStatus(reservation.reservation_id, "Cancelled")}
                              style={{ width: "100px" }}
                              disabled={loadingIds.has(reservation.reservation_id) || reservation.status === "Cancelled"}
                            >
                              Cancel
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Reservations;