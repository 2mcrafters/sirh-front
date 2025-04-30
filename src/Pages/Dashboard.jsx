import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user, roles } = useSelector((state) => state.auth);

  return (
    <div>
      <h2>Bienvenue, {user?.name}</h2>
      <h4>Rôle : {roles.join(', ')}</h4>
    </div>
  );
};

export default Dashboard;
