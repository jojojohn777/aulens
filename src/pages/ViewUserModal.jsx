import React from 'react';

const ViewUserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Business:</strong> {user.business}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>State:</strong> {user.state}</p>
          <p><strong>District:</strong> {user.district}</p>
          <p><strong>Thaluk:</strong> {user.thaluk}</p>
          <p><strong>WhatsApp:</strong> {user.whatsapp}</p>
          <p><strong>Terms & Conditions:</strong> {user.TermCond}</p>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
