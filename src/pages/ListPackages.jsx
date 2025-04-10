import React, { useEffect, useState } from "react";

const ListPackages = ({ goBack, onEdit }) => {
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        fetch("http://localhost:1337/package/findAll",{
            credentials: "include",
        })  // Replace with your actual API endpoint
            .then((res) => res.json())
            .then((data) => setPackages(data))
            .catch((err) => console.error("Error fetching packages:", err));
    }, []);

    const handleDelete = (packageId) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            fetch(`http://localhost:1337/package/delete/${packageId}`, {
                method: "DELETE",
                credentials: "include",
            })
            .then((res) => res.json())
            .then(() => {
                alert("Package deleted successfully!");
                setPackages(packages.filter(pkg => pkg.PackageId !== packageId));
            })
            .catch((err) => console.error("Error deleting package:", err));
        }
    };

    return (
        <div>
            <h2>List of Packages</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Package ID</th>
                        <th>Package Name</th>
                        <th>Action</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map((pkg) => (
                        <tr key={pkg.id}>
                            <td>{pkg.id}</td>
                            <td>{pkg.PackageName}</td>
                            <td>
                                <button onClick={() => onEdit(pkg)}>Edit</button>
                            </td>
                            <td>
                            <button onClick={() => handleDelete(pkg.id)} style={{ marginLeft: "10px", color: "red" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={goBack}>Back</button>
        </div>
    );
};

export default ListPackages;