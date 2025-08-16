import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import SalesForm from './components/SalesForm';
import CustomerForm from './components/CustomerForm';
import Reports from './components/Reports';
import Ledger from './components/Ledger';
import Help from './components/Help';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import VendorDashboard from './components/VendorDashboard/VendorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/admin/dashboard', '/vendor/dashboard'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Existing bakery pages */}
          <Route path="/products" element={<ProductForm />} />
          <Route path="/sales" element={<SalesForm />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/customers" element={<CustomerForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/help" element={<Help />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        </Routes>

        <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      </Layout>
    </Router>
  );
}

export default App;
