import React, { useState } from 'react';
import {  useRoutes, Navigate } from 'react-router-dom';
import Login from './Login';
import ReceiptList from './ReceiptList';
import AddReceipt from './AddReceipt'
import EditReceipt from './EditReceipt'

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const routes = useRoutes([
    {
      path: 'login',
      element: user ? <Navigate to="/receipt-list" /> : <Login onLogin={handleLogin} />,
    },
    {
      path: 'receipt-list',
      element: user ? <ReceiptList username={user} onLogout={handleLogout} /> : <Navigate to="/login" />,
    },
    {
      path: 'add-receipt',
      element: user ? <AddReceipt /> : <Navigate to="/login" />,
    },
    {
      path: 'edit-receipt/:receiptNumber',
      element: user ? <EditReceipt /> : <Navigate to="/login" />,
    },
    {
      path: '/',
      element: user ? <Navigate to="/receipt-list" /> : <Navigate to="/login" />,
    },
  ]);

  return (
    <div>
      {routes}
    </div>
  );
}

export default App;
