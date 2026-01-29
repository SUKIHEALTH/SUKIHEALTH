import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import './ChatComponent.css';

const PaymentSuccess = () => {
  const location = useLocation();

  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const appointmentId = searchParams.get('appointmentId');
  const consultantId = searchParams.get('consultantId');

  const [status, setStatus] = useState('Loading...');
  const fetchPaymentStatus = async () => {
    setStatus('Payment Successful!');
  };
  useEffect(() => {
    fetchPaymentStatus();
    
  });
  return (
    <div className="chat-container">
      <h1>Payment Status</h1>
      
      <p>Appointment ID: {appointmentId}</p>
      <p>Consultant ID: {consultantId}</p>
      <p>{status}</p>
    </div>
  );
};

export default PaymentSuccess;
