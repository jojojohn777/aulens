import { useState } from "react";


const AddGroup = ({ userid }) => {

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([
    { username: "", email: "", phoneNumber: "", whatsappNumber: "" },
    { username: "", email: "", phoneNumber: "", whatsappNumber: "" },
    { username: "", email: "", phoneNumber: "", whatsappNumber: "" }
  ]);

  const handleUserChange = (index, field, value) => {
    setUsers((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index
          ? { ...user, [field]: value, ...(field === "phoneNumber" && { whatsappNumber: value }) }
          : user
      )
    );
  };

  const handleAddUser = () => {
    setUsers((prevUsers) => [...prevUsers, { username: "", email: "", phoneNumber: "", whatsappNumber: "" }]);
  };

  const handleDeleteUser = (index) => {
    if (users.length > 3) {
      setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any user's email already exists
    for (const user of users) {
      if (user.email) {
        try {
          const checkResponse = await fetch('http://localhost:1337/user/checkemail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }),
          });

          const checkResult = await checkResponse.json();

          if (checkResponse.ok && checkResult.exists) {
            alert(`User with email "${user.email}" already exists!`);
            return; // Stop further execution
          }
        } catch (error) {
          console.error("Error checking email:", error);
          alert("Something went wrong while checking emails. Please try again.");
          return;
        }
      }
    }
    const payload = {
      parentuserId: userid,
      groupName,
      description,
      roleid:2,  // for group admin
      users
    };

    console.log("Submitting:", payload);

    try {
      const response = await fetch("http://localhost:1337/group/create", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Group "${groupName}" added successfully!`);
        setGroupName("");
        setDescription("");
        setUsers([
          { username: "", email: "", phoneNumber: "", whatsappNumber: "" },
          { username: "", email: "", phoneNumber: "", whatsappNumber: "" },
          { username: "", email: "", phoneNumber: "", whatsappNumber: "" }
        ]);
      } else {
        alert(`Error: ${result.message || "Failed to add Group"}`);
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
        <input type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        {users.map((user, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input type="text" placeholder="Username" value={user.username} onChange={(e) => handleUserChange(index, "username", e.target.value)} required />
            <input type="email" placeholder="Email" value={user.email} onChange={(e) => handleUserChange(index, "email", e.target.value)} required />
            <input type="text" placeholder="Phone Number" value={user.phoneNumber} onChange={(e) => handleUserChange(index, "phoneNumber", e.target.value)} required />
            <input type="text" placeholder="WhatsApp Number" value={user.whatsappNumber} onChange={(e) => handleUserChange(index, "whatsappNumber", e.target.value)} required />
            <button
              type="button"
              onClick={() => handleDeleteUser(index)}
              disabled={users.length <= 3}
              style={{
                background: users.length <= 3 ? "gray" : "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: users.length <= 3 ? "not-allowed" : "pointer"
              }}
            >
              Delete
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddUser}>+ Add User</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddGroup;
