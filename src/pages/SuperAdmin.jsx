import { useState } from "react";
import AddGroup from "./AddGroup";
import Package from "./Package";
import AddGroupMembers from "./AddGroupMembers";




const SuperAdmin = ({onLogout,userid}) => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  return (
    <div className="container">
      <div className="button-group">
        <button onClick={() => setSelectedComponent("addGroup")}>Add Group</button>
        <button onClick={() => setSelectedComponent("addMembers")}>Add Members</button>
        <button onClick={() => setSelectedComponent("package")}>Package</button>
        <button onClick={onLogout}>Logout</button>
      </div>

      <div className="content">
        {selectedComponent === "addGroup" && <AddGroup userid={userid}/>}
        {selectedComponent === "package" && <Package />}
        {selectedComponent === "addMembers" && <AddGroupMembers />}
      </div>
    </div>
  );
};

export default SuperAdmin;
