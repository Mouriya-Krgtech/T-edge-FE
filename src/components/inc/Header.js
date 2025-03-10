import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchConvertors, logoutUser } from "../ApiService";

const Header = () => {
  const [convertors, setConvertors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });


  useEffect(() => {
    // Fetch username and email from localStorage
    const storedUsername = localStorage.getItem("username") || "Guest";
    const storedEmail = localStorage.getItem("email") || "No Email";

    setUserInfo({ username: storedUsername, email: storedEmail });
  }, []);

  useEffect(() => {
    const getConvertors = async () => {
      try {
        const data = await fetchConvertors(); // Fetch categories from API service
        setConvertors(data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    getConvertors();
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon");
    } else if (currentHour >= 18 && currentHour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  return (
    <div>
      <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
          <div className="me-3">
            <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-bs-toggle="minimize">
              <span className="icon-menu"></span>
            </button>
          </div>
          <div>
            <Link  className="navbar-brand brand-logo" to="/homepage">
              <img src="assets/images/6.png" alt="logo" />
            </Link>
            <Link className="navbar-brand brand-logo-mini" to="/homepage">
              <img src="assets/images/TedgeLogo.png" alt="logo" />
            </Link>
          </div>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-top">
          <ul className="navbar-nav">
            <li className="nav-item fw-semibold d-none d-lg-block ms-0">
              <h1 className="welcome-text">{greeting}, <span className="text-black fw-bold">{userInfo.username}</span></h1>
              {/* <h3 className="welcome-sub-text">Your performance summary this week </h3> */}
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item d-none d-lg-block">
              <div id="datepicker-popup" className="input-group date datepicker navbar-date-picker">
                <span className="input-group-addon input-group-prepend border-right">
                  {/* <span className="icon-calendar input-group-text calendar-icon"></span> */}
                </span>
                <input type="text" className="form-control" />
              </div>
            </li>
            {/* <li className="nav-item">
              <form className="search-form" action="#">
                <i className="icon-search"></i>
                <input type="search" className="form-control" placeholder="Search Here" title="Search here" />
              </form>
            </li> */}
            {/* <li className="nav-item dropdown">
              <a className="nav-link count-indicator" id="countDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="icon-mail icon-lg"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="countDropdown">
                <a className="dropdown-item py-3">
                  <p className="mb-0 fw-medium float-start">You have 7 unread mails </p>
                  <span className="badge badge-pill badge-primary float-end">View all</span>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="assets/images/faces/face10.jpg" alt="image" className="img-sm profile-pic" />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis fw-medium text-dark">Marian Garner </p>
                    <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="assets/images/faces/face12.jpg" alt="image" className="img-sm profile-pic" />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis fw-medium text-dark">David Grey </p>
                    <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="assets/images/faces/face1.jpg" alt="image" className="img-sm profile-pic" />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis fw-medium text-dark">Travis Jenkins </p>
                    <p className="fw-light small-text mb-0"> The meeting is cancelled </p>
                  </div>
                </a>
              </div>
            </li> */}
            <li className="nav-item dropdown">
              <a className="nav-link count-indicator" id="notificationDropdown" href="#" data-bs-toggle="dropdown">
                <i className="icon-bell"></i>
                <span className="count"></span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="notificationDropdown">
                <a className="dropdown-item py-3 border-bottom">
                  <p className="mb-0 fw-medium float-start">You have 4 new notifications </p>
                  <span className="badge badge-pill badge-primary float-end">View all</span>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-alert m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject fw-normal text-dark mb-1">Application Error</h6>
                    <p className="fw-light small-text mb-0"> Just now </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-lock-outline m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject fw-normal text-dark mb-1">Settings</h6>
                    <p className="fw-light small-text mb-0"> Private message </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-airballoon m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject fw-normal text-dark mb-1">New user registration</h6>
                    <p className="fw-light small-text mb-0"> 2 days ago </p>
                  </div>
                </a>
              </div>
            </li>
            
            <li className="nav-item dropdown d-none d-lg-block user-dropdown">
              <a className="nav-link" id="UserDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="pi pi-user" style={{ color: 'black'}}></i>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                <div className="dropdown-header text-center">
                  {/* <img className="img-md rounded-circle" src="assets/images/faces/face8.jpg" alt="Profile image" /> */}
                  <i className="pi pi-user" style={{ color: '#708090' }}></i>
                  <p className="mb-1 mt-3 fw-semibold">{userInfo.username}</p>
                  <p className="fw-light text-muted mb-0">{userInfo.email}</p>
                </div>
                <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2"></i> My Profile <span className="badge badge-pill badge-danger">1</span></a>
                {/* <a className="dropdown-item"><i className="dropdown-item-icon mdi mdi-help-circle-outline text-primary me-2"></i> FAQ</a> */}
                <Link
                  to="/" 
                  className="dropdown-item" 
                  onClick={async (event) => { 
                    event.preventDefault(); // Prevent default navigation
                    try { 
                      await logoutUser(); 
                      window.location.href = "/"; // Redirect after logout
                    } catch (error) { 
                      console.error(error.message); 
                      alert(error.message); 
                    } 
                  }}
                >
                  <i className="dropdown-item-icon mdi mdi-power text-primary me-2"></i> Sign Out
                </Link>
              </div>
            </li>
          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-bs-toggle="offcanvas">
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Header