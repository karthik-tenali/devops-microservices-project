import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/users')
      .then(response => setUsers(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;

