import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const vendorData = localStorage.getItem("vendor");
    if (vendorData) {
      const parsed = JSON.parse(vendorData);
      setVendor(parsed);
      setFormData(parsed);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("vendorToken");

      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/vendors/me`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setVendor(res.data.vendor);
      localStorage.setItem("vendor", JSON.stringify(res.data.vendor));
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!vendor) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
        <span className="ms-2">Loading...</span>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h3 className="text-center fw-bold mb-4 text-primary">
                Business Profile
              </h3>

              {/* Profile fields */}
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="fw-semibold">{vendor.name}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Business Name</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="fw-semibold">{vendor.businessName}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mobile</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="fw-semibold">{vendor.mobile}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      ) : (
                        <p className="fw-semibold">{vendor.email}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  {editMode ? (
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="fw-semibold">{vendor.address}</p>
                  )}
                </Form.Group>
              </Form>

              {/* Action buttons */}
              <div className="d-flex justify-content-between mt-4">
                {editMode ? (
                  <>
                    <Button
                      variant="success"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditMode(false);
                        setFormData(vendor);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                )}

                <Link to="/dashboard">
                  <Button variant="warning" className="text-dark fw-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorDashboard;
