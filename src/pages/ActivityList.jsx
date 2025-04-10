import React, { useState, useEffect } from "react";

const ActivityList = ({ userID }) => {
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (userID) {
      fetchActivities(userID, selectedDate);
    }
  }, [userID, selectedDate]);

  const fetchActivities = async (userID, date) => {
    try {
      const response = await fetch("http://localhost:1337/activityLogin/findByUserAndDate", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, date }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();

      // Sort by recent date/time
      const sortedData = data.sort((a, b) => new Date(b.activity_time) - new Date(a.activity_time));

      setActivities(sortedData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div>
      <h2>Activities</h2>
      <label>
        Select Date:
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </label>

      <ul>
        {activities.length > 0 ? (
          activities.map((activity) => {
            const dateTime = activity.activity_time;
            const [date, time] = dateTime?.split(" ") || ["Invalid", "Invalid"];
            return (
              <li key={activity.id}>
                <strong>{activity.activity}</strong> – {date} {time}
              </li>
            );
          })
        ) : (
          <p>No activities found</p>
        )}
      </ul>
    </div>
  );
};

export default ActivityList;
