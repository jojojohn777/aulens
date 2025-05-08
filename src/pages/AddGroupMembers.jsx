import React, { useState, useEffect } from "react";
import Select from "react-select";
import * as XLSX from "xlsx";
import axios from "axios";

// const Group = require('../models/Group');

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddGroupMembers = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [entryMode, setEntryMode] = useState("csv");

  const [users, setUsers] = useState([
    { name: "", phoneNumber: "", email: "", password: "" },
  ]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/group/findAll`, {
        withCredentials: true,
      });
      const groupOptions = response.data.map((group) => ({
        value: group.GroupID,
        label: group.GroupName,
      }));
      setGroups(groupOptions);
    } catch (error) {
      console.error("Error fetching groupsff", error);
    }
  };
  // console.log(fetchGroups());
  

  const fetchUsers = async (groupId) => {
    try {
      const response = await axios.get(`${BASE_URL}/group-admins/groupadmins/${groupId}`, {
        withCredentials: true,
      });

      const adminOptions = response.data.map((admin) => ({
        value: admin.userid,
        label: admin.name,
      }));

      setAdmins(adminOptions);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleGroupChange = (selectedOption) => {
    setSelectedGroup(selectedOption);
    setAdmins([]);
    setSelectedAdmin(null);
    fetchUsers(selectedOption.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setFileData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmitcsv = async () => {
    if (!selectedGroup || !selectedAdmin) {
      alert("Please select a group and admin.");
      return;
    }

    if (entryMode === "csv") {
      if (fileData.length === 0) {
        alert("Please upload an Excel file.");
        return;
      }

      try {
        const payload = {
          groupId: selectedGroup.value,
          adminId: selectedAdmin.value,
          roleId: 3,
          fileData,
        };

        const response = await axios.post(`${BASE_URL}/group-members/upload`, payload, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to add users");
        }
        alert("File uploaded successfully!");
        setFileData([]);
        setAdmins([]);
      } catch (error) {
        console.error("Error uploading file", error);
        alert("Failed to upload file.");
      }
    }
  };

  const handleSubmit = async (index) => {
    if (!selectedGroup || !selectedAdmin) {
      alert("Please select a group and admin.");
      return;
    }

    const user = users[index];

    if (!user.phoneNumber && !user.email) {
      alert("At least a phone number or email is required.");
      return;
    }

    if (!user.password || user.password.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }

    try {
      const payload = {
        groupId: selectedGroup.value,
        adminId: selectedAdmin.value,
        roleId: 3,
        fileData: [
          {
            name: user.name,
            phone: user.phoneNumber,
            email: user.email || null,
            password: user.password,
          },
        ],
      };

      const response = await axios.post(`${BASE_URL}/group-members/upload`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to add user");
      }

      alert(`User ${user.name || ""} added successfully!`);

      setUsers((prev) =>
        prev.map((u, i) =>
          i === index ? { name: "", phoneNumber: "", email: "", password: "" } : u
        )
      );
    } catch (error) {
      console.error("Error adding user", error);
      alert(`Failed to add user ${user.name || ""}.`);
    }
  };

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

  return (
    <div className="upload-container">
      <h2>Add Group Members</h2>

      <div>
        <label>Select Group:</label>
        <Select
          options={groups}
          onChange={handleGroupChange}
          value={selectedGroup}
          isSearchable
          placeholder="Search & select a group..."
        />
      </div>

      {selectedGroup && (
        <div>
          <label>Select Admin:</label>
          <Select
            options={admins}
            onChange={setSelectedAdmin}
            value={selectedAdmin}
            isSearchable
            placeholder="Search & select an admin..."
          />
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <label>
          <input
            type="radio"
            value="csv"
            checked={entryMode === "csv"}
            onChange={() => setEntryMode("csv")}
          />
          Upload CSV
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            value="manual"
            checked={entryMode === "manual"}
            onChange={() => setEntryMode("manual")}
          />
          Manual Entry
        </label>
      </div>

      {entryMode === "csv" && (
        <div>
          <label>Upload Excel File:</label>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <button onClick={handleSubmitcsv} style={{ marginTop: "1rem" }}>
            Submit
          </button>
          {fileData.length > 0 && (
            <div>
              <h3>Preview:</h3>
              <ul>
                {fileData.slice(0, 5).map((row, index) => (
                  <li key={index}>{JSON.stringify(row)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {entryMode === "manual" && (
        <div style={{ marginTop: "1rem" }}>
          {users.map((user, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
            >
              <input
                type="text"
                placeholder="Name"
                value={user.name}
                onChange={(e) => handleUserChange(index, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={user.phoneNumber}
                onChange={(e) => handleUserChange(index, "phoneNumber", e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => handleUserChange(index, "email", e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => handleUserChange(index, "password", e.target.value)}
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
              <button
                type="button"
                onClick={() => handleSubmit(index)}
                style={{
                  background: "green",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddUser} style={{ marginTop: "1rem" }}>
            + Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default AddGroupMembers;
