import React, { useState } from "react";

const EditPackage = ({ goBack, packageData }) => {
    const [formData, setFormData] = useState({ ...packageData });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value ? parseFloat(value) : "" });
    };

    const totalCost = formData.Instance * formData.Costper; // Total cost calculation
    const finalPrice = totalCost - (totalCost * formData.Discount) / 100; // Applying discount

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            PackageName: formData.PackageName,
            Description: formData.Description,
            Costper: formData.Costper,
            Cost: finalPrice.toFixed(2),  // Ensure 2 decimal places
            Validity: formData.Validity,
            Instance: formData.Instance,
            Discount: formData.Discount
        };

        fetch(`http://localhost:1337/package/update/${formData.PackageId}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        .then((res) => res.json())
        .then(() => {
            alert("Package updated successfully!");
            goBack();
        })
        .catch((err) => console.error("Error updating package:", err));
    };

    return (
        <div>
            <h2>Edit Package</h2>
            <form onSubmit={handleSubmit}>
                <label>Package Name:</label>
                <input type="text" name="PackageName" value={formData.PackageName} onChange={handleChange} required />

                <label>Description:</label>
                <textarea name="Description" value={formData.Description} onChange={handleChange} />

                <label>Validity (Days):</label>
                <input type="number" name="Validity" value={formData.Validity} min="1" onChange={handleChange} required />

                <label>Instances:</label>
                <input type="number" name="Instance" value={formData.Instance} min="1" onChange={handleChange} required />

                <label>Cost per Instance:</label>
                <input type="number" name="Costper" value={formData.Costper} min="0" step="0.01" onChange={handleChange} required />

                <label>Discount %:</label>
                <input type="number" name="Discount" value={formData.Discount} min="0" max="100" step="0.01" onChange={handleChange} required />

                <div><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</div>
                <div><strong>Final Price (After Discount):</strong> ${finalPrice.toFixed(2)}</div>

                <button type="submit">Update Package</button>
            </form>
            <button onClick={goBack}>Back</button>
        </div>
    );
};

export default EditPackage;
