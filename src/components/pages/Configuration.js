import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  createConfiguration,
  fetchConfiguration,
  fetchHostConfigurations,
  updateHostConfiguration,
  uploadExcel,
  fetchDevices,
  addHostConfiguration,
  addDevices,
  updateDevice,

} from "../ApiService";
import { useLoading } from "../context/LoadingContext";

const Configuration = () => {
  const { id } = useParams(); // Get convertor ID from URL
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("");
  const [file, setFile] = useState(null);
  const {setLoading} = useLoading();
  const navigate = useNavigate();
  const [hostConfigurations, setHostConfigurations] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [devices, setDevices] = useState([]);
  //const [selectedInput, setSelectedInput] = useState(null);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isAddCanvasOpen, setIsAddCanvasOpen] = useState(false);
  const [isEditCanvasOpen, setIsEditCanvasOpen] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [isDeviceTableVisible, setIsDeviceTableVisible] = useState(false);
  const [isAddDeviceOffCanvasOpen, setIsAddDeviceOffCanvasOpen] = useState(false);
  const [isEditDeviceOffCanvasOpen, setIsEditDeviceOffCanvasOpen] = useState(false);

 
  const [selectedInput, setSelectedInput] = useState({
    configuration: "",
    port: "",
    baudrate: "",
    stopbits: "",
    parity: "",
    databits: "",
    reg_type: "",
    data_type: "",
  });

  const [selectedDevice, setSelectedDevice] = useState({ 
    name: "",
     address: ""
  });

  const handleDropdownChange = (selectedOption) => {
    setSelectedInput((prev) => ({
      ...prev,
      configuration: selectedOption ? selectedOption.value : "",
    }));
  };

  // Fetch configuration data when component mounts
  useEffect(() => {
    // setLoading(true);
    if (id) {
      console.log("Fetching Configuration for ID:", id);
      fetchConfiguration();
      fetchHostConfiguration(id);
    }
    // Fetch all configurations when the component loads
    
    fetchConfiguration().then(setConfigurations);
  }, [id]);

  // Fetch Device Inputs only after devices are loaded
  useEffect(() => {
    console.log("Devices updated, triggering fetchDeviceInput:", devices);
    if (devices.length > 0) {
      //fetchDeviceInput(devices);
    }
  }, [devices]);

  // Fetch Configuration Data
  const fetchHostConfiguration = async () => {
    try {
      // Step 1: Fetch all configurations
      const allConfigurations = await fetchConfiguration();
      console.log("All Configurations:", allConfigurations);
  
      // Step 2: Filter configurations that belong to the selected convertor
      const filteredConfigurations = allConfigurations.filter(
        (config) => config.convertor === parseInt(id)  // Match convertor ID
      );
      console.log("Filtered Configurations for Convertor:", filteredConfigurations);
  
      // Step 3: Extract configuration IDs
      const configIds = filteredConfigurations.map((config) => config.id);
  
      // Step 4: Fetch all host configurations
      const allHostConfigs = await fetchHostConfigurations();
      console.log("All Host Configurations:", allHostConfigs);
  
      // Step 5: Filter host configurations by matching `configuration ID`
      const filteredHostConfigs = allHostConfigs.filter((hostConfig) =>
        configIds.includes(hostConfig.configuration)  // Match config ID
      );
      console.log("Filtered Host Configurations:", filteredHostConfigs);
  
      // Step 6: Update state
      setHostConfigurations(filteredHostConfigs);
      setConfigurations(filteredConfigurations); // Ensure all configurations are displayed
    } catch (error) {
      console.error("Error fetching host configurations:", error);
    }
  };
  

  const handleEdit = (input) => {
    setSelectedInput(input);
    setIsEditCanvasOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeviceChange = (e) => {
    const { name, value } = e.target;
    setSelectedDevice((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
        try {
        
          const updatedData =await updateHostConfiguration(selectedInput.id, selectedInput);
          toast.success("Updated Host Configuration Successfully!");
          setIsEditCanvasOpen(false);
          // const updatedData = await DeviceInputListById(id);
          setSelectedInput(updatedData);         
        } catch (error) {
          toast.error("Error updating device input!");
        } finally {
          setTimeout(() => {
            window.location.reload();
            setLoading(false)
          }, 500);
        }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("channel", channel);
    formData.append("convertor", id); // Convertor ID
  
    try {
      let newConfig = null;
  
      
        // Step 1: Create Configuration
        const configResponse = await createConfiguration(formData);
        console.log("Configuration created:", configResponse);
        newConfig = configResponse;
  
        if (file) {
        // Step 2: Upload Excel file
        const fileFormData = new FormData();
        fileFormData.append("file", file);
        fileFormData.append("convertor_id", id);
        fileFormData.append("configuration_id", configResponse.id);
  
        await uploadExcel(fileFormData);
      }
  
      if (newConfig) {
        // 🔹 Fetch the latest configurations after submitting
        const updatedConfigs = await fetchConfiguration();
        setConfigurations(updatedConfigs); 
  
        // Alternatively, add the new config locally:
        // setConfigurations((prev) => [...prev, newConfig]);
      }
  
      toast.success("Configuration and Excel file processed successfully!");
      setName("");
      setChannel("");
      setFile(null);
      setIsOffCanvasOpen(false);
    } catch (error) {
      toast.error("Error creating configuration. Please try again.");
    } finally {
      setTimeout(() => {
        window.location.reload();
        setLoading(false);
      }, 500);
     
    }
  };

  const handleActionClick = async (configId) => {
    if (selectedConfigId === configId && isDeviceTableVisible) {
      setIsDeviceTableVisible(false);
      return;
    }
  
    //setLoading(true);
    setSelectedConfigId(configId);
    setIsDeviceTableVisible(true);
  
    try {
      // Fetch all devices
      const data = await fetchDevices();
      console.log("All Devices from API:", data);
  
      // 🔹 Correct Filtering: Only include devices linked to the selected host configuration
      const filteredData = data.filter((device) => device.host_configuration === configId);
      console.log("Filtered Devices:", filteredData);
  
      setDevices(filteredData);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      //setLoading(false);
    }
  };


  const handleHostSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload
    setLoading(true);
    const hostConfigData = {
      configuration: parseInt(selectedInput.configuration), // Convert to number
      port: selectedInput.port,
      baudrate: selectedInput.baudrate,
      stopbits: selectedInput.stopbits,
      parity: selectedInput.parity,
      databits: selectedInput.databits,
      reg_type: selectedInput.reg_type,
      data_type: selectedInput.data_type,
    };

    try {
      const response = await addHostConfiguration(hostConfigData); // Call API function
      console.log("Success:", response.data);
      toast.success("Added Host Configuration Successfully!");
      setIsAddCanvasOpen(false); 
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save configuration!");
    } finally {
      setTimeout(() => {
        window.location.reload();
        setLoading(false);
      }, 500); 
    }
  };

  const handleDeviceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newDevice = await addDevices({
        ...selectedDevice,
        host_configuration: selectedConfigId,
      });
      
      toast.success("Devices Added Successfully!..")
      setDevices([...devices, newDevice]);
      setSelectedDevice({ name: "", address: "" });
      setIsAddDeviceOffCanvasOpen(false);
    } catch (error) {
      console.error("Error saving device:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleEditDeviceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedDevice = await updateDevice(selectedDevice.id, selectedDevice);
  
      setDevices(devices.map((device) =>
        device.id === selectedDevice.id ? updatedDevice : device
      ));
      toast.success("Device Updated Sucessfully!...")
      setSelectedDevice({ name: "", address: "" });
      setIsEditDeviceOffCanvasOpen(false);
    } catch (error) {
      console.error("Error updating device:", error);
      toast.error("Error updating device")
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  
  
  const handleEditClick = (device) => {
    setSelectedDevice(device); // Load selected device into state
    setIsEditDeviceOffCanvasOpen(true); // Open edit modal
  };
  
  
  
  return (
    <>
      <div className="content-wrapper">
        {/* <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Configuration Form</h4>
                <form className="forms-sample material-form" onSubmit={handleSubmit}>
                  <div className="col-4">
                    <div className="form-group">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label className="control-label">Name</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <input
                        type="text"
                        required
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                      />
                      <label className="control-label">Channel</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <input
                        type="file"
                        className="form-control"
                        style={{ display: "block", border: "1px solid #ccc", padding: "6px", borderRadius: "5px" }}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="button-container">
                    <button type="submit" className="btn btn-outline-primary btn-sm me-2" disabled={loading}>
                      <span>{loading ? "Submitting..." : "Submit"}</span>
                    </button>
                    <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => navigate("/")}>
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> */}
        
        <div className="d-flex justify-content-between mb-3">
        <h2>Configuration List </h2>
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={() => setIsOffCanvasOpen(true)}
          >
            <i className="mdi mdi-plus"></i> Add Configuration
          </button>
        </div>

        {isOffCanvasOpen && (
          <div className="offcanvas offcanvas-end show" tabIndex="-1">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Add New Configuration</h5>
              <button type="button" className="btn-close " onClick={() => setIsOffCanvasOpen(false)}></button>
            </div>
            <div className="offcanvas-body">
            <form className="forms-sample material-form" onSubmit={handleSubmit}>
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label className="control-label">Name</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="text"
                        required
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                      />
                      <label className="control-label">Channel</label>
                      <i className="bar"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <input
                        type="file"
                        className="form-control"
                        style={{ display: "block", border: "1px solid #ccc", padding: "6px", borderRadius: "5px" }}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-outline-success btn-sm me-2">
                      {/* <span>{loading ? "Submitting..." : "Submit"}</span> */}
                      <i className="mdi mdi-check"></i>&nbsp; Submit
                    </button>
                    <button type="button" className="btn btn-outline-warning btn-sm"onClick={() => setIsOffCanvasOpen(false)}>
                      {/* <span>Cancel</span> */}<i className="mdi mdi-close"></i> Close
                    </button>
                  </div>
                </form>
            </div>
          </div>
        )}

        <table className="table table-bordered table-striped mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Channel</th>
              <th>Excel File Name</th>
              <th>Created Date</th>
              <th>Updated Date</th>
            </tr>
          </thead>
          <tbody>
            {configurations.length > 0 ? (
              configurations.map((config) => (
                <tr key={config.id}>
                  <td>{config.id}</td>
                  <td>{config.name}</td>
                  <td>{config.channel}</td>
                  <td>{config.excel_file_name}</td>
                  <td>{config.created_at}</td>
                  <td>{config.updated_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No configurations found</td>
              </tr>
            )}
          </tbody>
        </table>

    
        <div className="d-flex justify-content-between mt-3">
        <h2>Host Configuration Details</h2>
        <button 
          className="btn btn-outline-primary btn-sm" 
          onClick={() => { setIsAddCanvasOpen(true); setIsEditCanvasOpen(false); }}
        >
          <i className="mdi mdi-plus"></i> Add Host Configuration
        </button>
        </div>

        {isAddCanvasOpen  && (
          <div className="offcanvas offcanvas-end show" tabIndex="-1">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title">Add Host Configuration</h5>
              <button type="button" className="btn-close" onClick={() => setIsAddCanvasOpen(false)}></button>
            </div>

            <div className="offcanvas-body">
              <form className="forms-sample material-form" onSubmit={handleHostSubmit}>
                <div className="row">
                  {/* Configuration ID Dropdown */}
                  <div className="col-6">
                    <div className="form-group">
                      <input
                        type="text"
                        list="configurations"
                        name="configuration"
                        value={selectedInput.configuration}
                        onChange={handleChange}
                        required
                      />
                      <datalist id="configurations">
                        {configurations.map((config) => (
                          <option key={config.id} value={config.id}>
                            {config.name}
                          </option>
                        ))}
                      </datalist>
                      <label className="control-label">Select Configuration</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  {/* Port */}
                  <div className="col-6">
                    <div className="form-group">
                      <input type="text" name="port" value={selectedInput.port} onChange={handleChange} required />
                      <label className="control-label">Port</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  {/* Baudrate */}
                  <div className="col-6">
                    <div className="form-group">
                      <input type="text" name="baudrate" value={selectedInput.baudrate} onChange={handleChange} required />
                      <label className="control-label">Baudrate</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  {/* Stopbits */}
                  <div className="col-6">
                    <div className="form-group">
                      <input type="text" name="stopbits" value={selectedInput.stopbits} onChange={handleChange} required />
                      <label className="control-label">Stopbits</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  {/* Parity */}
                  <div className="col-6">
                    <div className="form-group">
                      <input type="text" name="parity" value={selectedInput.parity} onChange={handleChange} required />
                      <label className="control-label">Parity</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  {/* Databits */}
                  <div className="col-6">
                    <div className="form-group">
                      <input type="text" name="databits" value={selectedInput.databits} onChange={handleChange} required />
                      <label className="control-label">Data Bits</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  {/* Register Type */}
                  <div className="col-6">
                    <div className="form-group">
                      <input type="text" name="reg_type" value={selectedInput.reg_type} onChange={handleChange} required />
                      <label className="control-label">Register Type</label>
                      <i className="bar"></i>
                    </div>
                  </div>

                  {/* Data Type */}
                  <div className="col-6">
                    <div className="form-group">
                      <input type="text" name="data_type" value={selectedInput.data_type} onChange={handleChange} required />
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
                  <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => setIsAddCanvasOpen(false)}>
                    <i className="mdi mdi-close"></i> Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <table className="table table-bordered table-striped mt-4 mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Port</th>
              <th>Baudrate</th>
              <th>Stopbits</th>
              <th>Parity</th>
              <th>Databits</th>
              <th>Register Type</th>
              <th>Data Type</th>
              <th>Action</th>
              <th>Show Device</th>
            </tr>
          </thead>
          <tbody>
            {hostConfigurations.map((host) => (
              <tr key={host.hostConfigurations}>
                <td>{host.configuration}</td>
                <td>{host.port}</td>
                <td>{host.baudrate}</td>
                <td>{host.stopbits}</td>
                <td>{host.parity}</td>
                <td>{host.databits}</td>
                <td>{host.reg_type}</td>
                <td>{host.data_type}</td>
                <td>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => { handleEdit(host); setIsEditCanvasOpen(true); setIsAddCanvasOpen(false); }}
                >
                  <i className="mdi mdi-pen"></i>
                </button>
                </td>
                <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleActionClick(host.id)}
                    >
                      {selectedConfigId === host.id && isDeviceTableVisible
                      ?
                      (<>Hide Devices <i className="fa fa-angle-up"></i></> ):
                      (<>Show Devices <i className="fa fa-angle-down"></i></> )
                      }
                    </button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>

          {isEditCanvasOpen  && selectedInput && (
            <div className="offcanvas offcanvas-end show" tabIndex="-1">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">Edit Host Configuration</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsEditCanvasOpen(false)}
                ></button>
              </div>
                  <div className="offcanvas-body">
                    <form className="forms-sample material-form" onSubmit={handleUpdateSubmit}>
                      <div className="row">
                      {/* <div className="col-6 ">
                          <div className="form-group">
                            <input
                              type="text"
                              name="id"
                              value={selectedInput.id}
                              onChange={handleChange}
                              required
                            />
                            <label className="control-label" >ID</label>
                            <i className="bar"></i>
                          </div>
                        </div> */}

                        {/* configuration */}
                        <div className="col-6 ">
                          <div className="form-group">
                            <input
                              type="text"
                              name="configuration"
                              value={selectedInput.configuration}
                              onChange={handleChange}
                              required
                            />
                            <label className="control-label">Configuration</label>
                            <i className="bar"></i>
                          </div>
                        </div>

                        {/* Actual Name */}
                        <div className="col-6">
                          <div className="form-group">
                            <input
                              type="text"
                              name="port"
                              value={selectedInput.port}
                              onChange={handleChange}
                              required
                            />
                            <label className="control-label">Port</label>
                            <i className="bar"></i>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="col-6 ">
                          <div className="form-group">
                            <input
                              type="text"
                              name="baudrate"
                              value={selectedInput.baudrate}
                              onChange={handleChange}
                              required
                            />
                            <label className="control-label">Baudrate</label>
                            <i className="bar"></i>
                          </div>
                        </div>

                        {/* Register Type */}
                        <div className="col-6 ">
                          <div className="form-group">
                            <input
                              type="text"
                              name="reg_type"
                              value={selectedInput.reg_type}
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

                        <div className="col-6">
                          <div className="form-group">
                            <input
                              type="text"
                              name="databits"
                              value={selectedInput.databits}
                              onChange={handleChange}
                              required
                            />
                            <label className="control-label">Data Bits</label>
                            <i className="bar"></i>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <input
                              type="text"
                              name="stopbits"
                              value={selectedInput.stopbits}
                              onChange={handleChange}
                              required
                            />
                            <label className="control-label">Stopbits</label>
                            <i className="bar"></i>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <input
                              type="text"
                              name="parity"
                              value={selectedInput.parity}
                              onChange={handleChange}
                              required
                            />
                            <label className="control-label">Parity</label>
                            <i className="bar"></i>
                          </div>
                        </div>
                      </div>

                    {/* Modal Footer */}
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-outline-success btn-sm me-2"><i className="mdi mdi-check "></i>&nbsp; Save Changes</button>
                      <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => setIsEditCanvasOpen(false)}> <i className="mdi mdi-close"></i> Close</button>
                    </div>
                  </form>

                  </div>
                </div>
          )}

          {/* Device List */}
          {selectedConfigId && isDeviceTableVisible && (
            <>
              <div className="d-flex justify-content-between mb-3">
              <h2>Device List for Configuration</h2>
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => {
                    setSelectedDevice({ name: "", address: "" }); // Reset form for new device
                    setIsAddDeviceOffCanvasOpen(true);
                  }}
                >
                  <i className="mdi mdi-plus"></i> Add Device
                </button>
              </div>

              <table className="table table-bordered table-striped mt-4 mb-4">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(devices) && devices.length > 0 ? (
                    devices.map((device) => (
                      <tr key={device.address}>
                        <td>{device.name}</td>
                        <td>{device.address}</td>
                        <td>
                          {/* View Button */}
                          <button
                            className="btn btn-outline-primary btn-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="View Device Inputs"
                            onClick={() => navigate(`/deviceinput/${device.id}`)}
                          >
                            <i className="mdi mdi-eye"></i>
                          </button>

                          {/* Edit Button */}
                          <button
                            className="btn btn-outline-primary btn-sm ms-2"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Edit Device"
                            onClick={() => handleEditClick(device)}
                          >
                            <i className="mdi mdi-pen"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No devices found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Add Device Offcanvas */}
          {isAddDeviceOffCanvasOpen && (
            <div className="offcanvas offcanvas-end show" tabIndex="-1">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">Add Device</h5>
                <button type="button" className="btn-close" onClick={() => setIsAddDeviceOffCanvasOpen(false)}></button>
              </div>
              <div className="offcanvas-body">
                <form className="forms-sample material-form" onSubmit={handleDeviceSubmit}>
                  <div className="row">
                    {/* Device Name */}
                    <div className="col-6">
                      <div className="form-group">
                        <input type="text" name="name" value={selectedDevice.name} onChange={handleDeviceChange} required />
                        <label className="control-label">Device Name</label>
                        <i className="bar"></i>
                      </div>
                    </div>

                    {/* Device Address */}
                    <div className="col-6">
                      <div className="form-group">
                        <input type="text" name="address" value={selectedDevice.address} onChange={handleDeviceChange} required />
                        <label className="control-label">Device Address</label>
                        <i className="bar"></i>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-outline-success btn-sm me-2">
                      <i className="mdi mdi-check"></i>&nbsp; Submit
                    </button>
                    <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => setIsAddDeviceOffCanvasOpen(false)}>
                      <i className="mdi mdi-close"></i> Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Device Offcanvas */}
          {isEditDeviceOffCanvasOpen && (
            <div className="offcanvas offcanvas-end show" tabIndex="-1">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">Edit Device</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditDeviceOffCanvasOpen(false)}></button>
              </div>
              <div className="offcanvas-body">
                <form className="forms-sample material-form" onSubmit={handleEditDeviceSubmit}>
                  <div className="row">
                    {/* Device Name */}
                    <div className="col-6">
                      <div className="form-group">
                        <input type="text" name="name" value={selectedDevice.name} onChange={handleDeviceChange} required />
                        <label className="control-label">Device Name</label>
                        <i className="bar"></i>
                      </div>
                    </div>

                    {/* Device Address */}
                    <div className="col-6">
                      <div className="form-group">
                        <input type="text" name="address" value={selectedDevice.address} onChange={handleDeviceChange} required />
                        <label className="control-label">Device Address</label>
                        <i className="bar"></i>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-outline-success btn-sm me-2">
                      <i className="mdi mdi-check"></i>&nbsp; Save Changes
                    </button>
                    <button type="button" className="btn btn-outline-warning btn-sm" onClick={() => setIsEditDeviceOffCanvasOpen(false)}>
                      <i className="mdi mdi-close"></i> Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}



        {/* <h2>Device List</h2>
        <table className="table table-bordered table-striped mt-4">
          <thead>
            <tr>
              <th>Host Configuration</th>
              <th>Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.address}>
                <td>{device.host_configuration}</td>
                <td>{device.name}</td>
                <td>{device.address}</td>
                <td>
                <button
                  className="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip"  data-bs-placement="top" title="View Device Inputs"
                  onClick={() => navigate(`/deviceinput/${device.id}`)}
                >
                 <i className="mdi mdi-eye"></i>
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div>
    </>
  );
};

export default Configuration;