import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaUserClock,
  FaUserEdit,
  FaBars,
  FaTrash,
  FaCheck,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import { OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [vendors, setVendors] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: <FaBars /> },
    { key: "add", label: "Add Vendor", icon: <FaUserPlus /> },
    { key: "pending", label: "Pending Approvals", icon: <FaUserClock /> },
    { key: "manage", label: "Manage Profiles", icon: <FaUserEdit /> },
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors`
      );
      const all = res.data;
      setVendors(all);
      setPendingVendors(all.filter((v) => v.status === "pending"));
      setApprovedVendors(all.filter((v) => v.status === "approved"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddVendor = async (e) => {
  e.preventDefault();

  if (!name || !businessName || !mobile || !address || !password) {
    toast.error("Please fill all fields!");
    return;
  }

  try {
    setLoading(true);
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/vendors`, {
      name,
      businessName,
      mobile,
      address,
      password,
    });

    toast.success("Vendor added successfully!");
    console.log("Vendor Added:", response.data);

    // Clear form
    setName("");
    setBusinessName("");
    setMobile("");
    setAddress("");
    setPassword("");

    fetchVendors(); // Refresh vendor list
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to add vendor.";
    toast.error(errorMessage);
    console.error("Error adding vendor:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors/${id}`,
        { status: "approved" }
      );
      toast.success("Vendor approved!");
      fetchVendors();
    } catch (error) {
      toast.error("Failed to approve vendor.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors/${id}`,
        { status: "rejected" }
      );
      toast.info("Vendor rejected.");
      fetchVendors();
    } catch (error) {
      toast.error("Failed to reject vendor.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors/${id}`
      );
      toast.warning("Vendor deleted.");
      fetchVendors();
    } catch (error) {
      toast.error("Failed to delete vendor.");
    }
  };

  const handleEdit = (vendor) => {
    setEditVendor(vendor);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (
      !editVendor.name ||
      !editVendor.businessName ||
      !editVendor.mobile ||
      !editVendor.address
    ) {
      toast.error("Please fill all fields!");
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors/${editVendor._id}`,
        editVendor
      );
      toast.success("Vendor updated successfully!");
      setShowEditModal(false);
      fetchVendors();
    } catch (error) {
      toast.error("Failed to update vendor.");
    }
  };

  const handleChangePassword = (vendor) => {
    setEditVendor(vendor);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  const savePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password!");
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors/${editVendor._id}/password`,
        {
          password: newPassword,
        }
      );
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
    } catch (error) {
      toast.error("Failed to update password.");
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendors);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "vendors.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor List", 14, 10);
    const tableColumn = [
      "Name",
      "Business Name",
      "Mobile",
      "Address",
      "Status",
    ];
    const tableRows = vendors.map((vendor) => [
      vendor.name,
      vendor.businessName,
      vendor.mobile,
      vendor.address,
      vendor.status,
    ]);
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("vendors.pdf");
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex admin-dashboard">
      <ToastContainer />
      {/* Sidebar */}
      <div
        className={`d-flex flex-column bg-white shadow-sm border-end min-vh-100 ${
          collapsed ? "p-2" : "p-3"
        }`}
        style={{
          width: collapsed ? "70px" : "250px",
          transition: "width 0.3s ease",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          {!collapsed && (
            <h5 className="fw-bold text-dark mb-0">Admin Panel</h5>
          )}
          <button
            className="btn btn-sm btn-light border"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>
        <ul className="nav flex-column gap-2">
          {menu.map((item) => {
            const isActive = currentSection === item.key;
            const btnClass = isActive
              ? "btn-warning text-dark"
              : "btn-outline-secondary";
            const buttonContent = (
              <li className="nav-item">
                <button
                  className={`btn d-flex align-items-center w-100 fw-semibold px-2 py-2 rounded ${btnClass}`}
                  onClick={() => setCurrentSection(item.key)}
                >
                  <span className="me-2 fs-5">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
            return collapsed ? (
              <OverlayTrigger
                key={item.key}
                placement="right"
                overlay={<Tooltip>{item.label}</Tooltip>}
              >
                {buttonContent}
              </OverlayTrigger>
            ) : (
              <React.Fragment key={item.key}>{buttonContent}</React.Fragment>
            );
          })}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Dashboard Section */}
        {currentSection === "dashboard" && (
          <div>
            <h3 className="mb-4 text-primary fw-bold">Dashboard Overview</h3>
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card shadow text-center border-primary">
                  <div className="card-body">
                    <h6>Total Vendors</h6>
                    <h3>{vendors.length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow text-center border-warning">
                  <div className="card-body">
                    <h6>Pending Approvals</h6>
                    <h3>{pendingVendors.length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow text-center border-success">
                  <div className="card-body">
                    <h6>Approved Vendors</h6>
                    <h3>{approvedVendors.length}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            {/* <div className="card shadow p-3">
              <h5 className="mb-3">Recent Activities</h5>
              <ul className="mb-0">
                <li>Approved Vendor ABC</li>
                <li>Rejected Vendor XYZ</li>
                <li>Added new vendor DEF</li>
              </ul>
            </div> */}
          </div>
        )}

        {/* Add Vendor */}
        {currentSection === "add" && (
          <div className="card shadow p-4">
            <h4 className="text-primary mb-3">Add New Vendor</h4>
            <form onSubmit={handleAddVendor}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                ></textarea>
              </div>
              <button
                className="btn btn-success"
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Vendor"}
              </button>
            </form>
          </div>
        )}

        {/* Pending Approvals */}
        {currentSection === "pending" && (
          <div className="card shadow p-4">
            <h4 className="text-warning mb-3">Pending Approvals</h4>
            <table className="table table-bordered table-hover mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Business Name</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No pending vendors.
                    </td>
                  </tr>
                ) : (
                  pendingVendors.map((vendor) => (
                    <tr key={vendor._id}>
                      <td>{vendor.name}</td>
                      <td>{vendor.businessName}</td>
                      <td>{vendor.mobile}</td>
                      <td>{vendor.address}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleApprove(vendor._id)}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(vendor._id)}
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Manage Profiles */}
        {currentSection === "manage" && (
          <div className="card shadow p-4">
            <h4 className="text-primary mb-3">Manage Vendor Profiles</h4>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={exportToExcel}
                >
                  <FaDownload /> Excel
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={exportToPDF}
                >
                  <FaDownload /> PDF
                </button>
              </div>
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Business Name</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No vendors found.
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor._id}>
                      <td>{vendor.name}</td>
                      <td>{vendor.businessName}</td>
                      <td>{vendor.mobile}</td>
                      <td>{vendor.address}</td>
                      <td>{vendor.status}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleEdit(vendor)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleChangePassword(vendor)}
                        >
                          Change Password
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(vendor._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Vendor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editVendor && (
            <>
              <input
                type="text"
                className="form-control mb-2"
                value={editVendor.name}
                onChange={(e) =>
                  setEditVendor({ ...editVendor, name: e.target.value })
                }
                placeholder="Name"
              />
              <input
                type="text"
                className="form-control mb-2"
                value={editVendor.businessName}
                onChange={(e) =>
                  setEditVendor({ ...editVendor, businessName: e.target.value })
                }
                placeholder="Business Name"
              />
              <input
                type="text"
                className="form-control mb-2"
                value={editVendor.mobile}
                onChange={(e) =>
                  setEditVendor({ ...editVendor, mobile: e.target.value })
                }
                placeholder="Mobile"
              />
              <textarea
                className="form-control mb-2"
                value={editVendor.address}
                onChange={(e) =>
                  setEditVendor({ ...editVendor, address: e.target.value })
                }
                placeholder="Address"
              ></textarea>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={savePassword}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
