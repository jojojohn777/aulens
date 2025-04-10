import React, { useState, useEffect } from "react";
import Select from "react-select";
import * as XLSX from "xlsx";

const AddGroupMembers = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch groups from API
  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:1337/group/findAll",{
        credentials:"include"
      });
      if (!response.ok) throw new Error("Failed to fetch groups");
      const data = await response.json();
      const groupOptions = data.map((group) => ({
        value: group.GroupID,
        label: group.GroupName,
      }));
      setGroups(groupOptions);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  // Fetch admins & users when a group is selected
  const fetchUsers = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:1337/group-admins/groupadmins/${groupId}`,{
         credentials:"include"
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();

      // Separate admins and users
      const adminOptions = data.map((admin) => ({
          value: admin.userid,
          label: admin.name,
        }));

    
      setAdmins(adminOptions);
     
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // Handle group selection
  const handleGroupChange = (selectedOption) => {
    setSelectedGroup(selectedOption);
    setAdmins([]);
    setSelectedAdmin(null);
    fetchUsers(selectedOption.value);
  };

  // Handle file upload
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

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedGroup) {
      alert("Please select a group");
      return;
    }
    if (!selectedAdmin) {
      alert("Please select an admin");
      return;
    }
    if (fileData.length === 0) {
      alert("Please upload an Excel file");
      return;
    }

    try {
      const payload = {
        groupId: selectedGroup.value,
        adminId: selectedAdmin.value,
        roleId: 3, // Group Members role
        fileData,
      };
      console.log(payload);

      const response = await fetch("http://localhost:1337/group-members/upload", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to upload file");
      setFileData([]);
      setAdmins([]);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Excel File</h2>

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
        <>
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

        </>
      )}

      <div>
        <label>Upload Excel File:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

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

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AddGroupMembers;
