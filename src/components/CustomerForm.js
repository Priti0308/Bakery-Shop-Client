import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerForm = () => {
  const [form, setForm] = useState({ name: '', address: '', contact: '' });
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/customers/${editingId}`, form);
        toast.success('Customer updated');
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/customers`, form);
        toast.success('Customer added');
      }
      setForm({ name: '', address: '', contact: '' });
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
      toast.error('Failed to save customer');
    }
  };

  const handleEdit = (customer) => {
    setForm({ name: customer.name, address: customer.address, contact: customer.contact });
    setEditingId(customer._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/customers/${id}`);
      toast.success('Customer deleted');
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error('Failed to delete customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container my-5">
      <ToastContainer position="top-center" autoClose={2000} />

      {/* --- Add/Edit Customer Card --- */}
      <div className="card shadow border-0 mb-5">
        <div className="card-body p-4">
          <h2 className="text-primary mb-4">{editingId ? ' Update Customer' : ' Add Customer'}</h2>
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
              <button type="submit" className={`btn ${editingId ? 'btn-primary' : 'btn-success'} px-4`}>
                {editingId ? ' Update Customer' : ' Add Customer'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setForm({ name: '', address: '', contact: '' });
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              )}
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
                  <th>Name</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.address}</td>
                      <td>{c.contact}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(c)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
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
