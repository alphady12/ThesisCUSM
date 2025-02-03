import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal and Button
import { FaTrash } from 'react-icons/fa'; // Import trash icon from react-icons
import './slot.css';


axios.defaults.baseURL = "http://localhost:3001/api"; // Set the backend base URL


const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slotStatus, setSlotStatus] = useState("Available");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility


  // Fetch slots from the backend
  const fetchSlots = async () => {
    try {
      const response = await axios.get("/slots");
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };


  // Create a new slot
  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");


    if (!slotDate || !slotTime || !slotStatus) {
      setError("Please fill out all fields.");
      return;
    }


    try {
      const response = await axios.post("/slots", {
        slot_date: slotDate,
        slot_time: slotTime,
        status: slotStatus,
      });
      setSuccess(response.data.message);
      fetchSlots(); // Refresh slots
      setSlotDate("");
      setSlotTime("");
      setSlotStatus("Available");
      setShowModal(false); // Close the modal after creating the slot
    } catch (error) {
      setError("Failed to create slot. Please try again.");
      console.error("Error creating slot:", error);
    }
  };


  // Delete a slot
  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.delete(`/slots/${slotId}`);
      fetchSlots(); // Refresh slots
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };


  // Format date to a readable format (without time)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will display only the date in a user-friendly format (e.g., MM/DD/YYYY)
  };


  // Format time to a readable format (HH:mm:ss)
  const formatTime = (timeString) => {
    const time = new Date("1970-01-01T" + timeString + "Z"); // Create a date object with the time portion
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };


  useEffect(() => {
    fetchSlots();
  }, []);


  return (
    <div>
      <h1>Slot Management</h1>


      {/* Add Slot Button */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Slot
      </Button>


      {/* Modal for Slot Creation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateSlot}>
            <div>
              <label>
                Date:
                <input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Time:
                <input
                  type="time"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Status:
                <select
                  value={slotStatus}
                  onChange={(e) => setSlotStatus(e.target.value)}
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </label>
            </div>
            <button type="submit">Create Slot</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </Modal.Body>
      </Modal>


      <h2> Slot List</h2>
      <div className="slots-container">
        {slots.map((slot) => (
          <div
            key={slot.slot_id}
            className={`slot-box ${slot.status.toLowerCase()}`} // Conditionally apply classes based on slot status
          >
            <div className="delete-icon">
              <FaTrash
                onClick={() => handleDeleteSlot(slot.slot_id)}
                style={{ cursor: 'pointer', color: 'black' }}
                title="Delete Slot"
              />
            </div>
            <p><strong>Slot ID:</strong> {slot.slot_id}</p>
            <p><strong>Date:</strong> {formatDate(slot.slot_date)}</p>
            <p><strong>Time:</strong> {formatTime(slot.slot_time)}</p>
            <p><strong>Status:</strong> {slot.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default SlotManagement;


