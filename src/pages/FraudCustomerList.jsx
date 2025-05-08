import React, { useEffect, useState } from 'react';
import './FraudCustomerList.css';
import FraudEdit from './FraudEdit';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';


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

        const response = await axios.get(`${BASE_URL}/fraud-customer/findByUser/${userid}`, {
          withCredentials: true, // ✅ include credentials (cookies, auth headers, etc.)
        });

        const data = await response.data;
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

      const response = await axios.put(
        `${BASE_URL}/fraud-customer/update/${id}`,
        updatedData, // Axios automatically handles the body data as JSON
        {
          withCredentials: true, // Include credentials (cookies, auth headers, etc.)
          headers: {
            'Content-Type': 'application/json', // Optional: Axios sets this by default for JSON requests
          },
        }
      );

      if (response.status===200) {
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
      const response = await axios.delete(
        `${BASE_URL}/fraud-customer/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      // No need to check response.ok — if no error is thrown, it was successful
      setFraudCustomers((prev) => prev.filter((customer) => customer.id !== id));
      setFilteredCustomers((prev) => prev.filter((customer) => customer.id !== id));

    } catch (error) {
      console.error('Error deleting fraud customer:', error);
      alert('Failed to delete fraud customer.');
    }
  };

  if (loading) return <p>Loading fraud customers...</p>;
  if (fraudCustomers.length === 0) return <p>No fraud customers found.</p>;
  return (
    <div className="container main-section" style={{ maxWidth: '1000px' }}>
      {editingId ? (
        <FraudEdit
          customer={fraudCustomers.find((c) => c.id === editingId)}
          onSave={handleSaveEdit}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <>
          <div style={{ marginBottom: '25px' }}>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                padding: '12px 20px',
                marginBottom: '20px'
              }}
            />
          </div>
  
          <div style={{
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'var(--menu-hover-bg)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                  }}>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      color: 'var(--text-hover)',
                      borderBottom: '1px solid var(--border-color)'
                    }}>Name</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      color: 'var(--text-hover)',
                      borderBottom: '1px solid var(--border-color)'
                    }}>Phone</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      color: 'var(--text-hover)',
                      borderBottom: '1px solid var(--border-color)'
                    }}>Image</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      color: 'var(--text-hover)',
                      borderBottom: '1px solid var(--border-color)'
                    }}>Edit</th>
                    <th style={{
                      padding: '15px',
                      textAlign: 'left',
                      color: 'var(--text-hover)',
                      borderBottom: '1px solid var(--border-color)'
                    }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} style={{
                      borderBottom: '1px solid var(--border-color)',
                      '&:hover': {
                        backgroundColor: 'var(--menu-hover-bg)'
                      }
                    }}>
                      <td style={{ padding: '15px', color: 'var(--text-color)' }}>
                        {customer.name || "Not Provided"}
                      </td>
                      <td style={{ padding: '15px', color: 'var(--text-color)' }}>
                        {customer.phone || "Not Provided"}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {customer.ImagePath ? (
                          <img
                            src={`${BASE_URL}/images/${customer.ImagePath}`}
                            alt={customer.name}
                            onError={(e) => (e.target.style.display = 'none')}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)'
                            }}
                          />
                        ) : (
                          <span style={{ color: 'var(--text-color)' }}>No Image</span>
                        )}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button
                          onClick={() => setEditingId(customer.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            color: 'var(--btn-primary)',
                            border: '1px solid var(--btn-primary)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'var(--btn-primary)',
                              color: 'var(--bg-body)'
                            }
                          }}
                        >
                          Edit
                        </button>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            color: '#ff6b6b',
                            border: '1px solid #ff6b6b',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#ff6b6b',
                              color: 'var(--bg-body)'
                            }
                          }}
                        >
                          Delete
                        </button>
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
