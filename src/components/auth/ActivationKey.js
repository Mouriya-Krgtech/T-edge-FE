import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Image } from 'primereact/image';
import { checkActivationStatus, activateAccount } from '../ApiService';
import "./Activation.css";

const ActivationKey = () => {
    const [activationKey, setActivationKey] = useState('');
    const navigate = useNavigate();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return; // ✅ Prevent second execution
        hasFetched.current = true;

        const fetchActivationStatus = async () => {
            try {
                const statusData = await checkActivationStatus();
                if (statusData.is_active) {
                    toast.success('Device is already activated. Redirecting to login...');
                    navigate('/Login/');
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error checking activation status:', error);
                toast.error('Failed to check activation status.');
            }
        };

        fetchActivationStatus();
    }, [navigate]);
    const handleActivate = async () => {
        if (!activationKey.trim()) {
            toast.error('Please enter an activation key.');
            return;
        }

        try {
            const data = await activateAccount(activationKey);
            if (data) {
                if (data.message === 'Invalid license key.') {
                    toast.error('Invalid license key. Please check and try again.');
                    return;
                }
                if (data.message === 'License key has already been used.') {
                    toast.error('This key has already been used.');
                    return;
                }
                
                const statusData = await checkActivationStatus();
                if (statusData.is_active === true) {
                    toast.success('Device activated successfully!');
                    navigate('/Login/');
                } else {
                    toast.error('');
                }
            } 
        } catch (error) {
            console.error('Error during activation:', error);
            toast.error('An error occurred during activation.');
        }
    };

    return (
        <div className="activation-container">
            <Card
                header={
                    <div className="activation-header">
                        <Image
                            src="assets/images/Logo.jpg"
                            alt="Logo"
                            className="activation-logo"
                        />
                        <h3>Device Activation</h3>
                    </div>
                }
                className="activation-card"
            >
                <div className="activation-content">
                    <div className="activation-header-section">
                        <h3 className="activation-title"><i className="pi pi-key activation-icon"></i> Activate Your Device</h3>
                    </div>

                    <section className="activation-field-section">
                        <FloatLabel>
                            <InputText
                                id="activationKey"
                                value={activationKey}
                                onChange={(e) => setActivationKey(e.target.value)}
                                className="activation-input"
                            />
                            <label htmlFor="activationKey">Enter Your Activation Key</label>
                        </FloatLabel>
                        <span id="activationKey-help" className="activation-help">
                            Enter your activation key to proceed with device activation.
                        </span>
                    </section>

                    <Button
                        label="Activate"
                        onClick={handleActivate}
                        className="p-button p-button-success activation-button"
                    />
                </div>
            </Card>
        </div>
    );
};

export default ActivationKey;
