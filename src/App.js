import { HashRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from './components/context/LoadingContext';
import LoadingScreen from "./components/context/LoadingScreen"; // Import Loading Component
import HomePage from './components/pages/HomePage';
import Sidebar from './components/inc/Sidebar';
import Header from './components/inc/Header';
import Configuration from './components/pages/Configuration';
import ActivationKey from './components/auth/ActivationKey';
import LoginPage from './components/auth/LoginPage';
import DeviceInput from "./components/pages/DeviceInput";
import NotFound from "./components/NotFound";
import About from './components/pages/About';
import UserManagement from './components/pages/UserManagement';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <LoadingProvider> {/* Wrap the entire app */}
      <HashRouter>
        <LoadingScreen/> {/* Global Loading Indicator */}
        <Routes>
          <Route path="/" element={<ActivationKey />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="*" element={
            <>
              <Header />
              <div className="container-fluid page-body-wrapper">
                <Sidebar />
                <div className="main-panel">
                  <Routes>
                    <Route path="*" element={<HomePage />} />
                    <Route path="/configuration/:id" element={<Configuration />} />
                    <Route path="/deviceinput/:deviceId" element={<DeviceInput />} />
                    <Route path='/about/' element={<About />} />
                    <Route path='/usermanagement/' element={<UserManagement />} />
                    <Route path="/notfound" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </>
          } />
        </Routes>
        <ToastContainer 
          position="top-right"
          autoClose={1000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </HashRouter>
    </LoadingProvider>
  );
}

export default App;
