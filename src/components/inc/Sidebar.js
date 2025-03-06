import React, { useEffect,useState } from 'react'
import {Link} from 'react-router-dom'
import { fetchConvertors } from '../ApiService';

const Sidebar = () => {
  const [convertors, setConvertors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  return (
    <div >
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" to="/homepage">
                <i className="mdi mdi-grid-large menu-icon"></i>
                <span className="menu-title">Dashboard</span>
              </Link>
            </li>
            <li className="nav-item nav-category"></li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <i className="menu-icon mdi mdi-layers-outline"></i>
                <span className="menu-title">Converters</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  {loading ? (
                    <p className="dropdown-item text-center">Loading...</p>
                  ) : error ? (
                    <p className="dropdown-item text-danger text-center">{error}</p>
                  ) : (
                    convertors.map((convertors) => (
                      <li className="nav-item"> 
                        <Link key={convertors.id} className="nav-link" to={`/configuration/${convertors.id}`}>{convertors.name}</Link>
                      </li>
                      // <Link
                      //   key={convertors.id}
                      //   className="dropdown-item preview-item"
                      //   to={`/configuration/${convertors.id}`} // Navigate to configuration.js with the converter ID
                      // >
                      //   <div className="preview-item-content flex-grow py-2">
                      //     <p className="preview-subject ellipsis fw-medium text-dark">
                      //       {convertors.name}
                      //     </p>
                      //   </div>
                      // </Link>
                    ))
                  )}
                </ul>
              </div>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#form-elements" aria-expanded="false" aria-controls="form-elements">
                <i className="menu-icon mdi mdi-card-text-outline"></i>
                <span className="menu-title">Device Details</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="form-elements">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/devicedetails">
                      <span className="menu-title">Device Details</span>
                    </Link>
                  </li>                
                </ul>
              </div>
            </li> */}
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#form-elements" aria-expanded="false" aria-controls="form-elements">
                <i className="menu-icon mdi mdi-card-text-outline"></i>
                <span className="menu-title">Device Details</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="form-elements">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      <span className="menu-title">About</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/usermanagement">
                      <span className="menu-title">User Management</span>
                    </Link>
                  </li>                
                </ul>
              </div>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#form-elements" aria-expanded="false" aria-controls="form-elements">
                <i className="menu-icon mdi mdi-card-text-outline"></i>
                <span className="menu-title">Form elements</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="form-elements">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"><a className="nav-link" href="pages/forms/basic_elements.html">Basic Elements</a></li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#charts" aria-expanded="false" aria-controls="charts">
                <i className="menu-icon mdi mdi-chart-line"></i>
                <span className="menu-title">Charts</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="charts">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <a className="nav-link" href="pages/charts/chartjs.html">ChartJs</a></li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#tables" aria-expanded="false" aria-controls="tables">
                <i className="menu-icon mdi mdi-table"></i>
                <span className="menu-title">Tables</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="tables">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <a className="nav-link" href="pages/tables/basic-table.html">Basic table</a></li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#icons" aria-expanded="false" aria-controls="icons">
                <i className="menu-icon mdi mdi-layers-outline"></i>
                <span className="menu-title">Icons</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="icons">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <a className="nav-link" href="pages/icons/font-awesome.html">Font Awesome</a></li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
                <i className="menu-icon mdi mdi-account-circle-outline"></i>
                <span className="menu-title">User Pages</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="auth">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <a className="nav-link" href="pages/samples/blank-page.html"> Blank Page </a></li>
                  <li className="nav-item"> <a className="nav-link" href="pages/samples/error-404.html"> 404 </a></li>
                  <li className="nav-item"> <a className="nav-link" href="pages/samples/error-500.html"> 500 </a></li>
                  <li className="nav-item"> <a className="nav-link" href="pages/samples/login.html"> Login </a></li>
                  <li className="nav-item"> <a className="nav-link" href="pages/samples/register.html"> Register </a></li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="docs/documentation.html">
                <i className="menu-icon mdi mdi-file-document"></i>
                <span className="menu-title">Documentation</span>
              </a>
            </li> */}
          </ul>
      </nav>
    </div>
  )
}

export default Sidebar