import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Dashboard = () => {
  return (
    <div
      className="py-5"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="container bg-white bg-opacity-75 rounded p-4 shadow">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-black">🍩स्वीट्स अँड बेकर्स</h1>
          <p className="lead text-secondary">Welcome to the best bakery and sweets shop in town!</p>
        </div>

        <div className="row justify-content-center g-4">
          {/* Products in Stock */}
          <div className="col-md-4">
            <div className="card text-white shadow border-0">
              <div
                className="card-img-top bg-dark bg-opacity-50"
                style={{
                  backgroundImage: `url('https://www.datocms-assets.com/20941/1652115808-biscuitshero.png?auto=compress&fm=jpg&w=850')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '220px'
                }}
              ></div>
              <div className="card-body bg-success">
                <h5 className="card-title fw-bold">📦 Products in Stock</h5>
                <p className="card-text">Manage and update your product inventory.</p>
                <Link to="/products" className="btn btn-light fw-semibold">Manage Stock</Link>
              </div>
            </div>
          </div>

          {/* Customers */}
          <div className="col-md-4">
            <div className="card text-dark shadow border-0">
              <div
                className="card-img-top"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '220px'
                }}
              ></div>
              <div className="card-body bg-warning">
                <h5 className="card-title fw-bold">👥 Customers</h5>
                <p className="card-text">View and manage your customer records.</p>
                <Link to="/customers" className="btn btn-dark fw-semibold">Manage Customers</Link>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="col-md-4">
            <div className="card text-white shadow border-0">
              <div
                className="card-img-top"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlcG9ydHN8ZW58MHx8MHx8fDA%3D')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '220px'
                }}
              ></div>
              <div className="card-body bg-danger">
                <h5 className="card-title fw-bold">📊 Reports</h5>
                <p className="card-text">View your monthly sales and performance reports.</p>
                <Link to="/reports" className="btn btn-light fw-semibold">View Reports</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
