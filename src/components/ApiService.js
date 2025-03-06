import axios from "axios";
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/";

// Create an API client instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Activation Page
export const checkActivationStatus = async () => {
  try {
    const response = await apiClient.get('/authentication/activate/account/');
    return response.data; // Expecting response: { is_active: true/false, message: "status message" }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Network error while checking activation status');
    }
    throw error; // Re-throw to handle it in the component if needed
  }
};

export const activateAccount = async (activationKey) => {
  try {
    // Log the request data before sending the request
    console.log('Sending activation request with data:', { license_key: activationKey });

    // Send the POST request to the backend with the license key
    const response = await apiClient.post('/authentication/activate/account/', { license_key: activationKey });

    // Log the response data in case of success
    console.log('Response from activation request:', response.data);

    // Handle success
    if (response.status === 200) {
      toast.success('Account activated successfully!');
    } else {
      toast.error(response.data.message || 'Activation failed');
    }

    return response.data; // Return the response data

  } catch (error) {
    // Handle any errors that may occur
    if (error.response) {
      // Server-side error
      console.error('Error response:', error.response);
      toast.error(error.response.data.message);
    } else {
      // Network or other errors
      console.error('Network error:', error);
      toast.error('Network error. Please try again.');
    }
  }
};

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/authentication/login/', {
      email,
      password,
    });
    
    // Assuming the response contains tokens
    const { accessToken, refreshToken, username } = response.data;

    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username); // Store user info if needed
    localStorage.setItem("email", email);

    return response.data; // Return the response data
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200
      throw new Error(error.response.data.error || 'Login failed. Please check your credentials.');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please try again later.');
    } else {
      // Something else happened in setting up the request
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Logout function
export const logoutUser = async (navigate) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available.');
    }
    await apiClient.post('/authentication/logout/', { refresh_token: refreshToken });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    navigate('/');
  } catch (error) {
    if (error.response) {
      console.error('Logout failed:', error.response.data, 'Status:', error.response.status);
    } else if (error.request) {
      console.error('No response from server:', error.request);
    } else {
      console.error('Error setting up logout request:', error.message);
    }
    //alert('Logout failed. Please try again.');
  }
};


// Fetch Device Count
export const fetchDeviceCount = async () => {
  try {
    const response = await apiClient.get("/api/device-counts/");
    return response?.data ?? { count: 0 }; // Fallback to a default value
  } catch (error) {
    console.error("Error fetching Device Count:", error?.response?.data || error.message);
    throw error; // Re-throw to propagate the error
  }
};

// Fetch Convertors
export const fetchConvertors = async () => {
  try {
    const response = await apiClient.get("/convertors/");
    return response.data;
  } catch (error) {
    console.error("Error fetching Convertors:", error);
    throw error;
  }
};

// Create Configuration
export const createConfiguration = async (formData) => {
  try {
    const response = await apiClient.post("/configuration/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating configuration:", error);
    throw error;
  }
};

// Fetch Configurations
export const fetchConfiguration = async () => {
  try {
    const response = await apiClient.get("/configuration/");
    return response.data;
  } catch (error) {
    console.error("Error fetching Convertors:", error);
    throw error;
  }
};

//Add Host Configurations
export const addHostConfiguration = async (hostConfigData) => {
  try {
    const response = await apiClient.post("/hostconfiguration/", hostConfigData, {
    });
    return response.data;
  } catch (error) {
    console.error("Error Add Host Configuration:", error);
    throw error;
  }
};

// Fetch Host Configurations
export const fetchHostConfigurations = async () => {
  try {
    const response = await apiClient.get("/hostconfiguration/");
    return response.data;
  } catch (error) {
    console.error("Error fetching Configurations:", error);
    throw error;
  }
};

// Update Host Configurations
export const updateHostConfiguration = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/hostconfiguration/${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating device input:", error);
    throw error;
  }
};

// Fetch Devices
export const fetchDevices = async () => {
  try {
    const response = await apiClient.get("/devices/");
    return response.data;
  } catch (error) {
    console.error("Error fetching Devices:", error);
    throw error;
  }
};

//Add Devices
export const addDevices = async (deviceData) => {
  try {
    const response = await apiClient.post(`/devices/`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Error adding device:", error);
    throw error;
  }
}

//Update Devices
export const updateDevice = async (id, deviceData) => {
  try {
    const response = await apiClient.put(`/devices/${id}/`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Error adding device:", error);
    throw error;
  }
}


// Fetch Device Inputs
export const DeviceInputListById = async (deviceId) => {
  try {
    console.log("Fetching Device Inputs for Device ID:", deviceId);
    if (!deviceId) throw new Error("Device ID is undefined!");

    const response = await apiClient.get(`/deviceinputpoints/?device_id=${deviceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Device Inputs:", error);
    throw error;
  }
};

//Add DevicesInput Pionts
export const addDeviceInputPoints = async (deviceData) => {
  try {
    const response = await apiClient.post(`/deviceinputpoints/`, deviceData);
    return response.data;
  } catch (error) {
    console.error("Error adding device:", error.response?.data || error.message);
    throw error;
  }
};


export const updateDeviceInput = async (deviceId, updatedData) => {
  try {
    const response = await apiClient.put(`/deviceinputpoints/${deviceId}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating device input:", error);
    throw error;
  }
};

// Upload Excel
export const uploadExcel = async (fileFormData) => {
  try {
    const response = await apiClient.post("/upload-excel/", fileFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error;
  }
};

// Delete Excel
export const deleteExcel = async (fileFormData) => {
  try {
    const response = await apiClient.post("/delete-excel/", fileFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error;
  }
};

export default apiClient;
