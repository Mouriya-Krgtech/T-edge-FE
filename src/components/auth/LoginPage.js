import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../ApiService";
import { toast } from "react-toastify";


const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    const { username, password } = formData;

    try {
      const data = await loginUser(username, password);
      console.log("Login successful:", data);
      toast.success("Login successfully!!!")
      navigate("/homepage");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Invalid username or password");
    }
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo text-center">
                  <img src="assets/images/Logo.jpg" alt="logo"/>
                </div>
                <h4>Hello! Let’s get started</h4>
                <h6 className="fw-light">Sign in to continue.</h6>
                <form className="pt-3" onSubmit={handleLogin}>
                  {error && <p className="error-message text-danger">{error}</p>}
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="mt-3 d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg auth-form-btn">
                      SIGN IN
                    </button>
                  </div>
                  {/* <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" /> Keep me signed in
                      </label>
                    </div>
                    <a href="www.google.com" className="auth-link text-black">Forgot password?</a>
                  </div> */}
                  {/* <div className="mb-2 d-grid gap-2">
                    <button type="button" className="btn btn-facebook auth-form-btn">
                      <i className="ti-facebook me-2"></i>Connect using Facebook
                    </button>
                  </div> */}
                  {/* <div className="text-center mt-4 fw-light">
                    Don’t have an account? <a href="/register" className="text-primary">Create</a>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
