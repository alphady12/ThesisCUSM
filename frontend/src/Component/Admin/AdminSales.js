import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form, Container, Row, Col } from 'react-bootstrap';


const Sales = () => {
  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({
    condo_id: '',
    user_id: '',
    customer_id: '',
    sale_date: '',
    sale_price: 0,
    payment_method: '',
    transaction_id: ''
  });


  useEffect(() => {
    fetchSales();
  }, []);


  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sales');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/sales', formData);
      setFormData({
        condo_id: '',
        user_id: '',
        customer_id: '',
        sale_date: '',
        sale_price: 0,
        payment_method: '',
        transaction_id: ''
      });
      fetchSales();
    } catch (error) {
      console.error('Error adding sale:', error.response ? error.response.data : 'Internal Server Error');
    }
  };


  const deleteSale = async (saleId) => {
    try {
      await axios.delete(`http://localhost:3001/api/sales/${saleId}`);
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };


  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <div className="p-3 border rounded">
            <h2>Add New Sale</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formCondoID">
                <Form.Label>Condo ID:</Form.Label>
                <Form.Control type="text" name="condo_id" value={formData.condo_id} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formUserID">
                <Form.Label>User ID:</Form.Label>
                <Form.Control type="text" name="user_id" value={formData.user_id} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formCustomerID">
                <Form.Label>Customer ID:</Form.Label>
                <Form.Control type="text" name="customer_id" value={formData.customer_id} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formSaleDate">
                <Form.Label>Sale Date:</Form.Label>
                <Form.Control type="date" name="sale_date" value={formData.sale_date} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formSalePrice">
                <Form.Label>Sale Price:</Form.Label>
                <Form.Control type="number" name="sale_price" value={formData.sale_price} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formPaymentMethod">
                <Form.Label>Payment Method:</Form.Label>
                <Form.Control type="text" name="payment_method" value={formData.payment_method} onChange={handleChange} required />
              </Form.Group>
              <Form.Group controlId="formTransactionID">
                <Form.Label>Transaction ID:</Form.Label>
                <Form.Control type="text" name="transaction_id" value={formData.transaction_id} onChange={handleChange} required />
              </Form.Group>
              <Button type="submit">Add Sale</Button>
            </Form>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-3 border rounded">
            <h2>Existing Sales</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Condo ID</th>
                  <th>User ID</th>
                  <th>Customer ID</th>
                  <th>Sale Date</th>
                  <th>Sale Price</th>
                  <th>Payment Method</th>
                  <th>Transaction ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.sale_id}>
                    <td>{sale.condo_id}</td>
                    <td>{sale.user_id}</td>
                    <td>{sale.customer_id}</td>
                    <td>{sale.sale_date}</td>
                    <td>{sale.sale_price}</td>
                    <td>{sale.payment_method}</td>
                    <td>{sale.transaction_id}</td>
                    <td>
                      <Button variant="danger" onClick={() => deleteSale(sale.sale_id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};


export default Sales;
