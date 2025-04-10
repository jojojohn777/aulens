import React, { useEffect, useState } from 'react';
import './FraudCustomerList.css';
import FraudEdit from './FraudEdit';

const FraudCustomerList = ({ userid }) => {
  const [fraudCustomers, setFraudCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!userid) return;

    const fetchFraudCustomers = async () => {
      try {
        const response = await fetch(`http://localhost:1337/fraud-customer/findByUser/${userid}`, {
          method: "GET",
          credentials: "include", // ✅ include credentials (cookies, auth headers, etc.)
        });
        const data = await response.json();
        setFraudCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error('Error fetching fraud customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFraudCustomers();
  }, [userid]);

  useEffect(() => {
    setFilteredCustomers(
      fraudCustomers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, fraudCustomers]);

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:1337/fraud-customer/update/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setFraudCustomers((prev) =>
          prev.map((customer) => (customer.id === id ? { ...customer, ...updatedData } : customer))
        );
        setFilteredCustomers((prev) =>
          prev.map((customer) => (customer.id === id ? { ...customer, ...updatedData } : customer))
        );
        setEditingId(null);
      } else {
        alert('Failed to update fraud customer.');
      }
    } catch (error) {
      console.error('Error updating fraud customer:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`http://localhost:1337/fraud-customer/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setFraudCustomers((prev) => prev.filter((customer) => customer.id !== id));
        setFilteredCustomers((prev) => prev.filter((customer) => customer.id !== id));
      } else {
        alert('Failed to delete fraud customer.');
      }
    } catch (error) {
      console.error('Error deleting fraud customer:', error);
    }
  };

  if (loading) return <p>Loading fraud customers...</p>;
  if (fraudCustomers.length === 0) return <p>No fraud customers found.</p>;

  return (
    <div className="fraud-container-edit">
      {editingId ? (
        <FraudEdit
          customer={fraudCustomers.find((c) => c.id === editingId)}
          onSave={handleSaveEdit}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box"
          />
          <div className="table-container">
            <div className="table-body-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Image</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name || "Not Provided"}</td>
                      <td>{customer.phone || "Not Provided"}</td>
                      <td>
                        {customer.ImagePath ? (
                          <img
                            src={`http://localhost:1337/images/${customer.ImagePath}`}
                            alt={customer.name}
                            onError={(e) => (e.target.style.display = 'none')}
                            className="customer-image"
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td>
                        <button onClick={() => setEditingId(customer.id)}>Edit</button>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(customer.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FraudCustomerList;
