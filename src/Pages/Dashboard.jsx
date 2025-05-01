import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user, roles } = useSelector((state) => state.auth);

  return (
    <div className="container mt-4">
      {user ? (
        <>
          <h2>Bienvenue, {user.name}</h2>
          <h4>Rôle : {roles.join(', ')}</h4>
        </>
      ) : (
        <div className="text-center">
          <h2>Bienvenue sur le tableau de bord</h2>
          <p>Veuillez vous connecter pour voir votre profil.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
