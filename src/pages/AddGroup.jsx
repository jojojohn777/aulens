import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

const AddGroup = ({ userid }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([
    { name: "", phoneNumber: "", email: "", password: "" },
  ]);

  const handleUserChange = (index, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, [field]: value } : user
      )
    );
  };

  const handleAddUser = () => {
    setUsers((prevUsers) => [
      ...prevUsers,
      { name: "", phoneNumber: "", email: "", password: "" },
    ]);
  };

  const handleDeleteUser = (index) => {
    if (users.length > 1) {
      setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailSet = new Set();

    for (const user of users) {
      if (!user.phoneNumber && !user.email) {
        alert("At least a phone number or email is required for each user.");
        return;
      }

      if (!user.phoneNumber) {
        alert("Phone number is mandatory.");
        return;
      }

      if (user.email) {
        if (emailSet.has(user.email)) {
          alert(
            `Duplicate email found: "${user.email}". Please ensure all emails are unique.`
          );
          return;
        }
        emailSet.add(user.email);
      }
    }

    for (const user of users) {
      if (user.email) {
        try {
          const checkResponse = await axios.post(
            `${BASE_URL}/user/checkemail`,
            { email: user.email },
            { headers: { "Content-Type": "application/json" } }
          );
          const checkResult = checkResponse.data;
          if (checkResult.exists) {
            alert(`User with email "${user.email}" already exists!`);
            return;
          }
        } catch (error) {
          console.error("Error checking email:", error);
          alert(
            "Something went wrong while checking emails. Please try again."
          );
          return;
        }
      }
    }

    // Format users with proper trimming
    const formattedUsers = users.map((u) => ({
      // Trim name if it exists, otherwise use empty string
      name: (u.name || "").trim(),

      // Trim email if it exists, otherwise use empty string
      email: (u.email || "").trim(),

      // Trim phone number (required field)
      phoneNumber: (u.phoneNumber || "").trim(),

      // Don't trim password, but provide default if empty
      password: u.password.trim() || "123456", // Optional default password
    }));

    console.log(formattedUsers);
    

    const payload = {
      parentuserId: userid,
      groupName,
      description,
      roleid: 2,
      users: formattedUsers,
    };

    console.log("Submitting:", payload);

    try {
      const response = await axios.post(`${BASE_URL}/group/create`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert(`Group "${groupName}" added successfully!`);
        setGroupName("");
        setDescription("");
        setUsers([{ name: "", phoneNumber: "", email: "", password: "" }]);
      } else {
        alert(`Error: ${response.data.message || "Failed to add Group"}`);
      }
    } catch (error) {
      console.error("Error adding Group:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add Group</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {users.map((user, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Name (optional)"
              value={user.name}
              onChange={(e) => handleUserChange(index, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number (required)"
              value={user.phoneNumber}
              onChange={(e) =>
                handleUserChange(index, "phoneNumber", e.target.value)
              }
              required
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={user.email}
              onChange={(e) => handleUserChange(index, "email", e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                handleUserChange(index, "password", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => handleDeleteUser(index)}
              disabled={users.length <= 1}
              style={{
                background: users.length <= 1 ? "gray" : "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: users.length <= 1 ? "not-allowed" : "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddUser}>
          + Add User
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddGroup;
