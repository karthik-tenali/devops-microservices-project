import React from 'react';
import EntityList from './EntityList';

const userFields = [
  { name: 'id', label: 'ID', type: 'number' },
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
];

function UserList(props) {
  return <EntityList {...props} apiBaseUrl="http://localhost:8000/users" fields={userFields} title="User" />;
}

export default UserList;

