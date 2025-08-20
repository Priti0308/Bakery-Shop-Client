import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (role === "admin") {
      try {
        // Call your backend admin login endpoint
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/login`,
          {
            username,
            password,
          }
        );

        if (res.data && res.data.token) {
          localStorage.setItem("adminToken", res.data.token);
          localStorage.setItem("admin", JSON.stringify(res.data.admin));
          toast.success("Admin login successful!");
          navigate("/admin/dashboard");
        } else {
          toast.error("Invalid admin credentials!");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Admin login failed. Please check your credentials."
        );
      }
    } else {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/vendors/login`,
          {
            mobile: number,
            password,
          }
        );
        if (res.data.vendor && res.data.token) {
          localStorage.setItem("vendor", JSON.stringify(res.data.vendor));
          localStorage.setItem("vendorToken", res.data.token);
        } else if (res.data.token) {
          const { token, ...vendorFields } = res.data;
          localStorage.setItem("vendor", JSON.stringify(vendorFields));
          localStorage.setItem("vendorToken", token);
        } else {
          localStorage.setItem("vendor", JSON.stringify(res.data));
        }
        toast.success("Vendor login successful!");
        navigate("/vendor/dashboard");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Vendor login failed. Please check your credentials."
        );
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-3">
          <h3 className="mt-2 fw-bold">Login</h3>
        </div>

        <form onSubmit={handleLogin}>
          {role === "admin" ? (
            <>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter mobile number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 d-flex justify-content-around">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="role"
                id="adminRole"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />
              <label className="form-check-label" htmlFor="adminRole">
                Admin
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                name="role"
                id="vendorRole"
                value="vendor"
                checked={role === "vendor"}
                onChange={() => setRole("vendor")}
              />
              <label className="form-check-label" htmlFor="vendorRole">
                Vendor
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#020c1bff",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Login as {role === "admin" ? "Admin" : "Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
