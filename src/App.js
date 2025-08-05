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
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import VendorDashboard from './components/VendorDashboard/VendorDashboard';

// ✅ Layout Component (must be inside Router)
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/home', '/admin/dashboard', '/vendor/dashboard'];

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
          <Route path="/" element={<Home />} />

          {/* Old default dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Existing bakery pages */}
          <Route path="/products" element={<ProductForm />} />
          <Route path="/sales" element={<SalesForm />} />
          <Route path="/customers" element={<CustomerForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/help" element={<Help />} />

          {/* New dashboards */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          

          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        </Routes>

        <ToastContainer position="top-center" autoClose={2000} />
      </Layout>
    </Router>
  );
}

export default App;
