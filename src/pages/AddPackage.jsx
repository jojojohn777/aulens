import React, { useState, useEffect } from "react";

const AddPackage = ({ goBack }) => {
    const [packageName, setPackageName] = useState("");
    const [instances, setInstances] = useState(1);
    const [timeInDays, setTimeInDays] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [costPerInstance, setCostPerInstance] = useState(0);
    const [customise, setCustomise] = useState(0); // 0 = Normal, 1 = Custom
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await fetch("http://localhost:1337/group/findAll", {
                credentials: 'include',
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

    const totalCost = instances * costPerInstance;
    const finalPrice = totalCost - (totalCost * discount) / 100;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const packageData = {
            PackageName: packageName,
            Description: `${instances} Instances for ${timeInDays} days`,
            Costper: costPerInstance,
            Cost: finalPrice.toFixed(2),
            Validity: timeInDays,
            Instance: instances,
            Discount: discount,
            Customise: customise,
            ...(customise === 1 && { GroupID: selectedGroup }),
        };

        try {
            console.log(packageData);
            const response = await fetch("http://localhost:1337/package/create", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(packageData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Package "${packageName}" added successfully!`);
                goBack();
            } else {
                alert(`Error: ${result.message || "Failed to add package"}`);
            }
        } catch (error) {
            console.error("Error adding package:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div>
            <h2>Add Package</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="radio"
                        name="customise"
                        value={0}
                        checked={customise === 0}
                        onChange={() => setCustomise(0)}
                    /> Normal
                </label>
                <label>
                    <input
                        type="radio"
                        name="customise"
                        value={1}
                        checked={customise === 1}
                        onChange={() => setCustomise(1)}
                    /> Custom
                </label>
                <br></br>
                {customise === 1 && (
                    <label>
                        Select Group:
                        <select value={selectedGroup || ""} onChange={(e) => setSelectedGroup(e.target.value)} required>
                            <option value="" disabled>Select a group</option>
                            {groups.map((group) => (
                                <option key={group.value} value={group.value}>{group.label}</option>
                            ))}
                        </select>
                    </label>
                )}
                <br>
                </br>

                <label>Package Name:</label>
                <input type="text" value={packageName} onChange={(e) => setPackageName(e.target.value)} required />

                <label>No. of Instances:</label>
                <input type="number" value={instances} onChange={(e) => setInstances(Math.max(1, Number(e.target.value)))} required />

                <label>Time (in Days):</label>
                <input type="number" value={timeInDays} onChange={(e) => setTimeInDays(Math.max(1, Number(e.target.value)))} required />

                <label>Discount %:</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))} required />

                <label>Cost per Instance:</label>
                <input type="number" value={costPerInstance} onChange={(e) => setCostPerInstance(Math.max(0, Number(e.target.value)))} required />

                <div><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</div>
                <div><strong>Final Price:</strong> ${finalPrice.toFixed(2)}</div>

                <button type="submit">Add Package</button>
            </form>
            <button onClick={goBack}>Back</button>
        </div>
    );
};

export default AddPackage;
