import React, { useContext } from 'react';
import { UserContext } from './UserContext'; // UserContext'in bulunduğu yolu ayarlayın

const SomeComponent = () => {
  const { currentUser, handleLogout } = useContext(UserContext);

  return (
    <div>
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default SomeComponent;
