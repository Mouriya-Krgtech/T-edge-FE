import React, { useEffect, useState } from "react";
import { FaMicrochip, FaNetworkWired, FaBuilding } from "react-icons/fa";
import { fetchDeviceCount } from "../ApiService"; // Ensure correct path
import { useLoading } from "../context/LoadingContext";

const HomePage = () => {
  const [counts, setCounts] = useState({
    modbus: '',
    mbus: 0,
    bacnet: 0,
  });
  const {loading, setLoading} = useLoading();

  useEffect(() => {
    const getCounts = async () => {
      setLoading(true);
      try {
        const data = await fetchDeviceCount();
        
        // Map API response to specific protocols
        const modbusCount = getDeviceCount(data.convertor_device_counts, "Modbus to BACnet IP");
        const bacnetCount = getDeviceCount(data.convertor_device_counts, "BACnet MSTP to BACnet IP");
        const mbusCount = getDeviceCount(data.convertor_device_counts, "Mbus to BACnet IP");

        setCounts({
          modbus: modbusCount,
          mbus: mbusCount,
          bacnet: bacnetCount,
        });
      } catch (error) {
        console.error("Failed to fetch counts", error);
      } finally {
        setTimeout(() => {
          setLoading(false); // Introduce a slight delay to improve UX
        }, 500);
      }
    };
    getCounts();
  }, []);

  // Helper function to get device count by converter name
  const getDeviceCount = (countsArray, name) => {
    const found = countsArray.find(item => item.convertor_name === name);
    return found ? found.device_count : 0;
  };

  return (
    <div className="container py-4">
      <div className="row g-3">
        
        {/* Modbus Card */}
        <DeviceCard
          title="Modbus"
          description="A robust serial communication protocol used in industrial automation."
          icon={<FaMicrochip size={50} />}
          bgColor="rgb(34, 193, 195)"
          count={counts.modbus}
          loading={loading}
        />

        {/* BACnet Card */}
        <DeviceCard
          title="BACnet"
          description="A communication protocol for building automation and control networks."
          icon={<FaBuilding size={50} />}
          bgColor="rgb(44, 62, 80)"
          count={counts.bacnet}
          loading={loading}
        />
        
        {/* M-Bus Card */}
        <DeviceCard
          title="M-Bus"
          description="Used for remote meter reading in energy and utility applications."
          icon={<FaNetworkWired size={50} />}
          bgColor="rgb(253, 187, 45)"
          count={counts.mbus}
          loading={loading}
        />

        

      </div>
    </div>
  );
};

// Device Card Component
const DeviceCard = ({ title, description, icon, bgColor, count, loading }) => (
  <div className="col-md-4">
    <div style={cardStyle(bgColor)} className="shadow-lg">
      {icon}
      <hr/>
      <h4>{title}</h4>
      <p>{description}</p>
      <h6>{loading ? "Loading..." : `Count: ${count}`}</h6>
      {/* <a href="#" className="btn btn-outline-light">Learn More</a> */}
    </div>
  </div>
);

// Common Card Styles
const cardStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "#fff",
  borderRadius: "15px",
  padding: "10px",
  textAlign: "center",
  transition: "transform 0.3s ease",
  cursor: "pointer",
});

export default HomePage;
