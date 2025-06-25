import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const CustomerForm = () => {
  const [form, setForm] = useState({ name: '', address: '', contact: '' });
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customers');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/customers`, form);
      setForm({ name: '', address: '', contact: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
      toast.error('Failed to add customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container my-5">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* --- Add Customer Card --- */}
      <div className="card shadow border-0 mb-5">
        <div className="card-body p-4">
          <h2 className="text-primary mb-4">📝 Add Customer</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Main Street"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
            </div>
            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-success px-4">
                ➕ Add Customer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- Customer List Table --- */}
      <div className="card shadow border-0">
        <div className="card-body p-4">
          <h3 className="text-primary mb-3">📋 Customer List</h3>
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Contact</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.address}</td>
                    <td>{c.contact}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
