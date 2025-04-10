import React, { useState } from "react";
import ListPackages from "./ListPackages";
import AddPackage from "./AddPackage";
import EditPackage from "./EditPackage";

const Package = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", border: "1px solid #ccc", borderRadius: "10px" }}>
            <h2>Package Management</h2>

            {/* Conditional Rendering */}
            {selectedOption === null && (
                <div>
                    <button onClick={() => setSelectedOption("list")}>List Packages</button>
                    <button onClick={() => setSelectedOption("add")}>Add New Package</button>
                   
                </div>
            )}
            
            {selectedOption === "list" && (<ListPackages goBack={() => setSelectedOption(null)} onEdit={(pkg) => {setSelectedPackage(pkg); setSelectedOption("edit");}}/>)}
            {selectedOption === "add" && <AddPackage goBack={() => setSelectedOption(null)} />}
            {selectedOption === "edit" && <EditPackage goBack={() => setSelectedOption(null)} packageData={selectedPackage}/>}
        </div>
    );
};

export default Package;