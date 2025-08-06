import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import logo from "./public/favicon.ico";

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "admin") {
      // Add validation if needed
      navigate("/admin/dashboard");
    } else {
      // Add validation if needed
      navigate("/vendor/dashboard");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-3">
          {/* <img src={logo} alt="Logo" style={{ width: "80px" }} /> */}
          <h3 className="mt-2">Bakery Shop Portal</h3>
        </div>

        <form onSubmit={handleLogin}>
          {/* Conditional Inputs Based on Role */}
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

          {/* Password Field */}
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

          {/* Role Selection */}
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

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#020c1bff", color: "#fff", fontWeight: "bold" }}
          >
            Login as {role === "admin" ? "Admin" : "Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
