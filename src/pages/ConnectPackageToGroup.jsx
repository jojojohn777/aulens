import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ConnectPackageToGroup = ({ goBack }) => {
    const [groups, setGroups] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedPackage, setSelectedPackage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false); // For tracking fetch status

    // Fetch all groups and packages when component mounts
    useEffect(() => {
        fetchGroups();
        fetchPackages();
    }, []);

    const fetchGroups = async () => {
        setFetching(true); // Start fetching groups
        try {
            const response = await axios.get(`${BASE_URL}/group/findAll`, {
                withCredentials: true,
            });
            const groupOptions = response.data.map((group) => ({
                value: group.GroupID,
                label: group.GroupName,
            }));
            setGroups(groupOptions); // Set groups in state
            console.log(groups);
        } catch (error) {
            console.error("Error fetching groups:", error);
            alert("Failed to fetch groups.");
        } finally {
            setFetching(false); // Stop fetching groups
        }
    };

    const fetchPackages = async () => {
        setFetching(true); // Start fetching packages
        try {
            const response = await axios.get(`${BASE_URL}/package/findAll`, {
                withCredentials: true,
            });
            const packageOptions = response.data.map((pkg) => ({
                PackageID: pkg.Packageid, // Ensure this matches the actual key
                PackageName: pkg.PackageName, // Ensure this matches the actual key
            }));
            setPackages(packageOptions); // Set packages in state
            console.log(packages)
        } catch (error) {
            console.error("Error fetching packages:", error);
            alert("Failed to fetch packages.");
        } finally {
            setFetching(false); // Stop fetching packages
        }
    };

    const handleSubmit = async () => {
        if (!selectedGroup || !selectedPackage) {
            alert("Please select both a group and a package.");
            return;
        }
        console.log(selectedGroup,selectedPackage);

        setLoading(true);
        try {
            await axios.post(
                `${BASE_URL}/groupToPackage/create`,
                {
                    GroupID: selectedGroup,
                    PackageID: selectedPackage,
                },
                { withCredentials: true }
            );

            alert("Package connected to group successfully!");
            goBack(); // Go back after successful submission
        } catch (error) {
            console.error("Error connecting package to group:", error);
            alert("Failed to connect package to group.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Connect Package to Group</h3>

            <div>
                <label>Select Group:</label>
                {fetching ? (
                    <p>Loading groups...</p> // Show a loading message if fetching
                ) : (
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        <option value="">-- Select Group --</option>
                        {groups.map((grp) => (
                            <option key={grp.value} value={grp.value}>
                                {grp.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div>
                <label>Select Package:</label>
                {fetching ? (
                    <p>Loading packages...</p> // Show a loading message if fetching
                ) : (
                    <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                    >
                        <option value="">-- Select Package --</option>
                        {packages.map((pkg) => (
                            <option key={pkg.PackageID} value={pkg.PackageID}>
                                {pkg.PackageName}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div>
                <button onClick={handleSubmit} disabled={loading || fetching}>
                    {loading ? "Connecting..." : "Connect"}
                </button>
            </div>

            <br />
            <button onClick={goBack} disabled={loading}>
                Go Back
            </button>
        </div>
    );
};

export default ConnectPackageToGroup;
