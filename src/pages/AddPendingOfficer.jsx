import React, { useState } from "react";

const AddPendingOfficer = ({ currentRoleId }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [roleId, setRoleId] = useState(currentRoleId === 1 ? 2 : 3); // Default based on role
    const [phoneExists, setPhoneExists] = useState(false);
    const [loading, setLoading] = useState(false);
    const AddedUserId = localStorage.getItem("userid");

    // Function to check if phone number exists
    const checkPhoneExists = async (phoneNumber) => {
        if (phoneNumber.length < 10) {
            setPhoneExists(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:1337/pendingOfficers/checkPhoneNumber/${phoneNumber}`);
            const data = await response.json();
            setPhoneExists(data.exists);
        } catch (error) {
            console.error("Error checking phone:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        checkPhoneExists(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phoneExists) return;

        const officerData = { 
            PhoneNumber: phone, 
            Name: name, 
            RoleID: roleId, 
            AddedUser: AddedUserId 
        };

        try {
            const response = await fetch("http://localhost:1337/pendingOfficers/create", {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(officerData),
            });

            if (response.ok) {
                alert("Officer added successfully!");
                setName("");
                setPhone("");
                setRoleId(currentRoleId === 1 ? 2 : 3); // Reset based on role
            } else {
                alert("Error adding officer!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Add Pending Officer</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Phone:</label>
                    <input 
                        type="text" 
                        value={phone} 
                        onChange={handlePhoneChange} 
                        required 
                    />
                    {loading && <p>Checking phone...</p>}
                    {phoneExists && <p style={{ color: "red" }}>Phone number already exists!</p>}
                </div>

                <div>
                    <label>Role:</label>
                    <select 
                        value={roleId} 
                        onChange={(e) => setRoleId(Number(e.target.value))} 
                        disabled={currentRoleId === 2} // Main Officers can only add Sub Officers
                    >
                        {currentRoleId === 1 && <option value={2}>Main Officer</option>}
                        {currentRoleId === 2 && <option value={3}>Sub Officer</option>}
                    </select>
                </div>

                <button type="submit" disabled={phoneExists}>Add Officer</button>
            </form>
        </div>
    );
};

export default AddPendingOfficer;
