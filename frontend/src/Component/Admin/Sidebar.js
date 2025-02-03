import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendarAlt, faMoneyBillAlt, faChartBar, faSignOutAlt, faAddressCard, faSimCard, faTabletAndroid} from '@fortawesome/free-solid-svg-icons';

//import DashboardImage from './Dashboard.png';
import Condos from './AdminCondos';
import ReservationsManagement from './AdminReservations';
import Customers from './AdminCustomers';
import Sales from './AdminSales';
import Buildings from './AdminBldg';
import Rooms from './AdminRoom';
import Messages from './Adminmessage';
import Customerinforeservation from './Admincustomerreserve';
import FloorRoomForm from './FloorRoomForm';

const SideBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        marginBottom: '20px'
    };

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: '#fff' }}>
            <div className="sidebar" style={{ background: '#CA3433', color: '#fff', padding: '5px', width: '50px',height: "2000px", position: 'fixed', top: 0, left: 0 }}>
                <h3 style={{ marginBottom: '90px', fontSize:10 }}>ADMINISTRATOR</h3>

                <Nav className="flex-column">
                    <Link to="/dashboard/condos" style={linkStyle}><FontAwesomeIcon icon={faBuilding} /> Condominiums</Link>
                    <Link to="/dashboard/reservations" style={linkStyle}><FontAwesomeIcon icon={faCalendarAlt} /> Reservation</Link>
                    <Link to="/dashboard/customers" style={linkStyle}><FontAwesomeIcon icon={faMoneyBillAlt} /> Customer</Link>
                    <Link to="/dashboard/sales" style={linkStyle}><FontAwesomeIcon icon={faChartBar} /> Sales</Link>
                    <Link to="/dashboard/bldg" style={linkStyle}><FontAwesomeIcon icon={faBuilding} /> Buildings</Link>
                    <Link to="/dashboard/room" style={linkStyle}><FontAwesomeIcon icon={faAddressCard} /> room</Link>
                    <Link to="/dashboard/message" style={linkStyle}><FontAwesomeIcon icon={faSimCard} /> message</Link>
                    <Link to="/dashboard/customerinforeservation" style={linkStyle}><FontAwesomeIcon icon={faTabletAndroid} /> Customer Reservations List</Link>
                    <Link to="/dashboard/floorroomForm" style={linkStyle}><FontAwesomeIcon icon={faTabletAndroid} /> Form</Link>
                    <Nav.Link onClick={handleLogout} style={{ color: '#fff', marginTop: '50px' }}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</Nav.Link>
                </Nav>
            </div>
            <div className="content" style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#fff', zIndex: '1' }}>
                    {/* <h1 style={{ fontSize: '3em' }}>WELCOME TO FUTURA MONTE</h1> */}
                </div>
                {/* <img src={DashboardImage} alt="Dashboard" style={{ maxWidth: '80%', maxHeight: '80%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} /> */}
                <Container fluid>
                    <Routes>
                        <Route path="/condos" element={<Condos />} />
                        <Route path="/reservations" element={<ReservationsManagement />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/bldg" element={<Buildings />} />
                        <Route path="/room" element={<Rooms />} />
                        <Route path="/message" element={<Messages />} />
                        <Route path="/customerinforeservation" element={<Customerinforeservation />} />
                        <Route path="/floorroomForm/*" element={<FloorRoomForm />} />
                    </Routes>
                </Container>
            </div>
        </div>
    );
};

export default SideBar;