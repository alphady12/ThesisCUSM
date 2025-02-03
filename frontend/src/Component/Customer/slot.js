import React, { useState, useEffect } from 'react';
import axios from 'axios';

// SlotList component to fetch and display slots
const SlotList = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/slots');
        setSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
        alert('Error occurred while fetching slots. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  return (
    <div>
      <h2>Slots</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {slots.map(slot => (
            <li key={slot.slot_id}>
              Condo ID: {slot.condo_id}, Start Date: {slot.start_date}, End Date: {slot.end_date}, Availability: {slot.availability}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// SlotCreationForm component with form to create a new slot
const SlotCreationForm = () => {
  const [formData, setFormData] = useState({
    condo_id: '',
    start_date: '',
    end_date: '',
    availability: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:3001/api/slots', formData);
      alert('Slot created successfully!');
      // Clear form after successful submission
      setFormData({
        condo_id: '',
        start_date: '',
        end_date: '',
        availability: ''
      });
    } catch (error) {
      console.error('Error creating slot:', error);
      alert('Error occurred while creating slot. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Slot</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="condo_id">Condo ID:</label>
          <input type="text" id="condo_id" name="condo_id" value={formData.condo_id} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="start_date">Start Date:</label>
          <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="availability">Availability:</label>
          <select id="availability" name="availability" value={formData.availability} onChange={handleChange} required>
            <option value="">Select availability</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>Create Slot</button>
      </form>
    </div>
  );
};

// Main component combining SlotCreationForm and SlotList
const SlotManagement = () => {
  return (
    <div>
      <SlotCreationForm />
      <SlotList />
    </div>
  );
};

export default SlotManagement;