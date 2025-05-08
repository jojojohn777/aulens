import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const readableNames = {
  "fraudcustomers/findone": "Check Fraud Customer",
  "fraudcustomers/create": "Add Fraud Customer",
  "fraudcustomers/delete": "Delete Fraud Customer",
  "fraudcustomers/update": "Update Fraud Customer",
  "aadharservices/verifyvoter": "Verify Voter ID",
  "aadharservices/verifyotp": "Verify Aadhar",
  "aadharservices/verifypassport": "Verify Passport",
  "aadharservices/drivinglicenceverify": "Verify Driving Licence",
};

const ActivityList = ({ userid }) => {
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (userid) {
      fetchActivities(userid, selectedDate);
    }
  }, [userid, selectedDate]);

  const fetchActivities = async (userid, date) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/activityLogin/findByUserAndDate`,
        { userid, date },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      // Sort by most recent time
      const sortedData = data.sort(
        (a, b) => new Date(b.activity_time) - new Date(a.activity_time)
      );

      setActivities(sortedData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="main-section">
      <h2 className="feature-text-content" style={{ marginBottom: '20px', color: 'var(--text-hover)' }}>Activities</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-color)' }}>
          Select Date:
          <input 
            type="date" 
            value={selectedDate} 
            onChange={handleDateChange}
            style={{
              padding: '8px 12px',
              borderRadius: '5px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-dropdown)',
              color: 'var(--text-color)'
            }}
          />
        </label>
      </div>
  
      {activities.length > 0 ? (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {activities.map((activity) => {
            const gmtDateTime = new Date(activity.activity_time);
            const istString = gmtDateTime.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            });
  
            const [date, time] = istString.split(", ").map((str) => str.trim());
            const readable = readableNames[activity.activity] || activity.activity;
  
            return (
              <li 
                key={activity.id}
                style={{
                  padding: '15px',
                  backgroundColor: 'var(--bg-dropdown)',
                  borderRadius: '5px',
                  borderLeft: '3px solid var(--btn-primary)'
                }}
              >
                <strong style={{ color: 'var(--btn-primary)' }}>{readable}</strong>
                <span style={{ color: 'var(--text-color)', margin: '0 8px' }}>–</span>
                <span style={{ color: 'var(--text-color)' }}>{date} {time}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div 
          className="feature-text-content" 
          style={{ 
            padding: '20px',
            backgroundColor: 'var(--bg-dropdown)',
            borderRadius: '5px',
            textAlign: 'center'
          }}
        >
          No activities found
        </div>
      )}
    </div>
  );
};

export default ActivityList;