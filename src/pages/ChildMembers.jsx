import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ViewUserModal from './ViewUserModal';// Ensure this path is correct

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChildMembers = ({ groupadminID }) => {
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/group-admins/groupadmins/${groupadminID}`);
        setMembers(res.data);

        // Set group name using business name from the first member
        if (res.data.length > 0) {
          setGroupName(res.data[0].business || 'N/A');
        }
      } catch (err) {
        console.error('Failed to load group members:', err);
      }
    };

    if (groupadminID) fetchData();
  }, [groupadminID]);

  const handleView = (user) => {
    setSelectedUser(user);  // Set the selected user for the modal
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Group: {groupName}</h1>

      {members.length === 0 ? (
        <p>No group members found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.userid} className="border-t">
                <td className="p-2">{member.name}</td>
                <td className="p-2">{member.mobile}</td>
                <td className="p-2">{member.email}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleView(member)}  // Set the selected user on click
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* If a user is selected, show the modal */}
      {selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}  // Close modal when 'onClose' is triggered
        />
      )}
    </div>
  );
};

export default ChildMembers;
