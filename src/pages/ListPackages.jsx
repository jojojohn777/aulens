import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios';

const ListPackages = ({ goBack, onEdit }) => {
    const [packages, setPackages] = useState([]);


    useEffect(() => {
        axios.get(`${BASE_URL}/package/findAll`, { withCredentials: true }) // Replace with your actual API endpoint
            .then((response) => {
                setPackages(response.data); // Assuming `setPackages` is your state updater
            })
            .catch((err) => {
                console.error("Error fetching packages:", err);
            });
    }, []);


    const handleDelete = (packageId) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            axios.delete(`${BASE_URL}/package/delete/${packageId}`, { withCredentials: true })
                .then(() => {
                    alert("Package deleted successfully!");
                    setPackages(packages.filter(pkg => pkg.PackageId !== packageId));
                })
                .catch((err) => {
                    console.error("Error deleting package:", err);
                });
        }
    };

    return (
        <div>
            <h2>List of Packages</h2>
            <table border="1">
                <thead>
                    <tr>

                        <th>Package Name</th>
                       
                        <th>Total_Cost</th>
                        <th>Validity</th>
                        <th>Customise</th>
                        <th>Action</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map((pkg) => (
                        <tr key={pkg.PackageId}>
                            <td>{pkg.PackageName}</td>
                            <td>{pkg.Total_Cost}</td>
                            <td>{pkg.Validity}</td>
                            <td>{pkg.Customise ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => onEdit(pkg)}>Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(pkg.PackageId)} style={{ marginLeft: "10px", color: "red" }}>
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