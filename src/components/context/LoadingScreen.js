import { useLoading } from "../context/LoadingContext";
import logo from "../images/TedgeLogo.png"; // Ensure correct path

const LoadingScreen = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
      
      <img src={logo} alt="Logo" className="logo" />
          
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
