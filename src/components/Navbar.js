import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Make sure this contains the CSS provided below

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 py-2">
    <div className="container-fluid">
      <Link className="navbar-brand fw-bold text-warning fs-4" to="/">
           इंद्रायणी बेकर्स
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto gap-2">
          <li className="nav-item">
            <Link className="nav-link nav-hover text-white fw-medium" to="/products">
              Stock
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link nav-hover text-white fw-medium" to="/sales">
              Sales
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link nav-hover text-white fw-medium" to="/customers">
              Customers
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link nav-hover text-white fw-medium" to="/reports">
              Reports
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link nav-hover text-white fw-medium" to="/ledger">
              Ledger
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
