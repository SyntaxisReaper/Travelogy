import React from 'react';
import { useNavigate } from 'react-router-dom';
import FirebaseTest from '../components/FirebaseTest';

const DashboardPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/');
  };

  return <FirebaseTest />;
};

export default DashboardPageWrapper;