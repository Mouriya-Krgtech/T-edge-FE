import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addDeviceInputPoints, DeviceInputListById, updateDeviceInput } from "../ApiService";
import { toast } from "react-toastify";
import { useLoading } from "../context/LoadingContext";

const DeviceInputPage = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [deviceInputs, setDeviceInputs] = useState([]);
  const {loading, setLoading} = useLoading()
  const [error, setError] = useState(null);
 // const [selectedInput, setSelectedInput] = useState(null);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isAddOffCanvasOpen, setAddIsOffCanvasOpen] = useState(false);
  const [selectedInput, setSelectedInput] = useState({
    name: "",
    actual_name: "",
    address: "",
    register_type: "",
    data_type: ""
  });
  
  


  useEffect(() =>  {
    const fetchDeviceInputs = async () => {
      setLoading(true)
      try {
        const data = await DeviceInputListById(deviceId);
        setDeviceInputs(data);
      } catch (err) {
        setError("Failed to fetch device inputs.");
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 500);
      }
    };
    fetchDeviceInputs();
  }, [deviceId]);

  const handleEdit = (input) => {
    setSelectedInput(input);
    setIsOffCanvasOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      // Ensure the new input is linked to the correct device
      const newInput = {
        device: deviceId, // ✅ Include deviceId properly
        name: selectedInput.name,
        actual_name: selectedInput.actual_name,
        address: selectedInput.address,
        register_type: selectedInput.register_type,
        data_type: selectedInput.data_type,
      };
  
      console.log("Sending Data to API:", newInput); // Debugging
  
      // ✅ Call the API with correct data
      await addDeviceInputPoints(newInput);
  
      toast.success("Device Input Points Added Successfully!");
  
      // ✅ Reset the form fields after submission
      setSelectedInput({
        name: "",
        actual_name: "",
        address: "",
        register_type: "",
        data_type: ""
      });
  
      setAddIsOffCanvasOpen(false);
      // Refresh the list after adding
      const updatedData = await DeviceInputListById(deviceId);
      setDeviceInputs(updatedData);
    } catch (error) {
      console.error("Error adding device input:", error.response?.data || error.message);
      toast.error("Error adding device input");
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500);
    }
  };
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDeviceInput(selectedInput.id, selectedInput);
      toast.success("Device Input Points Updated Successfully!");
      setIsOffCanvasOpen(false);
      const updatedData = await DeviceInputListById(deviceId);
      setDeviceInputs(updatedData);
      setSelectedInput({
        name: "",
        actual_name: "",
        address: "",
        register_type: "",
        data_type: ""
      });
    } catch (error) {
      toast.error("Error updating device input!");
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="content-wrapper">
        
        <h2 className="mb-4">Device Inputs for Device {deviceId}</h2>
          <div className="d-flex justify-content-between mb-3">
         
          <button className="btn btn-outline-warning btn-sm" onClick={() => navigate(-1)}>
            <i className="mdi mdi-backburger"></i>  Back
            </button>

          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={() => setAddIsOffCanvasOpen(true)}
          >
            <i className="mdi mdi-plus"></i> Add Device Input
          </button>
        </div>

       {/*ADD Device Input Points */}
       {isAddOffCanvasOpen && (
          <div className="offcanvas offcanvas-end show" tabIndex="-1">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Add Device Input</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setAddIsOffCanvasOpen(false)}
              ></button>
            </div>
            <div className="offcanvas-body">
              <form className="forms-sample material-form" onSubmit={handleAddSubmit}>
              <div className="row">
                {/* Name */}
                <div className="col-6 ">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={selectedInput.name}
                      onChange={handleChange}
                      required
                    />
                    <label className="control-label">Name</label>
                    <i className="bar"></i>
                  </div>
                </div>

                {/* Actual Name */}
                {/* <div className="col-6">
                  <div className="form-group">
                    <textarea
                      type="text"
                      name="actual_name"
                      value={selectedInput.actual_name}
                      onChange={handleChange}
                      required
                    />
                    <label className="control-label">Actual Name</label>
                    <i className="bar"></i>
                  </div>
                </div> */}

                {/* Address */}
                <div className="col-6 ">
                  <div className="form-group">
                    <input
                      type="text"
                      name="address"
                      value={selectedInput.address}
                      onChange={handleChange}
                      required
                    />
                    <label className="control-label">Address</label>
                    <i className="bar"></i>
                  </div>
                </div>

                {/* Register Type */}
                <div className="col-6 ">
                  <div className="form-group">
                    <input
                      type="text"
                      name="register_type"
                      value={selectedInput.register_type}
                      onChange={handleChange}
                      required
                    />
                    <label className="control-label">Register Type</label>
                    <i className="bar"></i>
                  </div>
                </div>

                {/* Data Type */}
                <div className="col-6">
                  <div className="form-group">
                    <input
                      type="text"
                      name="data_type"
                      value={selectedInput.data_type}
                      onChange={handleChange}
                      required
                    />
                    <label className="control-label">Data Type</label>
                    <i className="bar"></i>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button type="submit" className="btn btn-outline-success btn-sm me-2">
                  <i className="mdi mdi-check"></i>&nbsp; Submit
                </button>
                <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => setAddIsOffCanvasOpen(false)}>
                  <i className="mdi mdi-close"></i> Close
                </button>
              </div>
            </form>
          </div>
          </div>
        )}


        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Name</th>
              <th>Actual Name</th>
              <th>Address</th>
              <th>Register Type</th>
              <th>Data Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deviceInputs.length > 0 ? (
              deviceInputs.map((input) => (
                <tr key={`${input.device}-${input.address}`}>
                  <td>{input.device}</td>
                  <td>{input.name || "N/A"}</td>
                  <td>{input.actual_name || "N/A"}</td>
                  <td>{input.address || "N/A"}</td>
                  <td>{input.register_type || "N/A"}</td>
                  <td>{input.data_type || "N/A"}</td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip"  data-bs-placement="top" title="Edit Device Inputs" onClick={() => handleEdit(input)}>
                      <i className="mdi mdi-pen  "></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "red" }}>
                  No Device Inputs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal for Editing */}
        {isOffCanvasOpen && selectedInput && (
          <div className="offcanvas offcanvas-end show" tabIndex="-1">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Edit Device Input</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsOffCanvasOpen(false)}
              ></button>
            </div>
                <div className="offcanvas-body">
                  <form className="forms-sample material-form" onSubmit={handleUpdateSubmit}>
                    <div className="row">
                      {/* Name */}
                      <div className="col-12 ">
                        <div className="form-group">
                          <input
                            type="text"
                            name="name"
                            value={selectedInput.name}
                            onChange={handleChange}
                            required
                          />
                          <label className="control-label">Name</label>
                          <i className="bar"></i>
                        </div>
                      </div>

                      {/* Actual Name */}
                      {/* <div className="col-6">
                        <div className="form-group">
                          <textarea
                            type="text"
                            name="actual_name"
                            value={selectedInput.actual_name}
                            onChange={handleChange}
                            required
                          />
                          <label className="control-label">Actual Name</label>
                          <i className="bar"></i>
                        </div>
                      </div> */}

                      {/* Address */}
                      <div className="col-12 ">
                        <div className="form-group">
                          <input
                            type="text"
                            name="address"
                            value={selectedInput.address}
                            onChange={handleChange}
                            required
                          />
                          <label className="control-label">Address</label>
                          <i className="bar"></i>
                        </div>
                      </div>

                      {/* Register Type */}
                      <div className="col-12 ">
                        <div className="form-group">
                          <input
                            type="text"
                            name="register_type"
                            value={selectedInput.register_type}
                            onChange={handleChange}
                            required
                          />
                          <label className="control-label">Register Type</label>
                          <i className="bar"></i>
                        </div>
                      </div>

                      {/* Data Type */}
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="text"
                            name="data_type"
                            value={selectedInput.data_type}
                            onChange={handleChange}
                            required
                          />
                          <label className="control-label">Data Type</label>
                          <i className="bar"></i>
                        </div>
                      </div>
                    </div>

                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-outline-success btn-sm me-2"><i className="mdi mdi-check "></i>&nbsp; Save Changes</button>
                    <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => setIsOffCanvasOpen(false)}> <i className="mdi mdi-close"></i> Close</button>
                  </div>
                </form>

                </div>
              </div>
        )}
      </div>
    </>
    
  );
};

export default DeviceInputPage;
