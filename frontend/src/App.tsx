import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🌐 Travelogy - Simple Version
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        Welcome to Travelogy! This is a minimal version to test functionality.
      </p>
      <div style={{
        margin: '40px auto',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h2 style={{ color: '#2196F3' }}>App Status</h2>
        <p>✅ React is working</p>
        <p>✅ No white screen</p>
        <p>✅ Basic styling applied</p>
        <p>✅ Ready for incremental feature addition</p>
      </div>
    </div>
  );
}

export default App;
