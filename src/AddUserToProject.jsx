import { useState } from "react";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";
import { firestore } from "./firebase";

export default function AddUserToProject({ userUid }) {
  const [projectUid, setProjectUid] = useState("");

  async function handleAddUser(e) {
    e.preventDefault();

    try {
      if (!userUid) {
        console.log("No signed-in user");
        return;
      }

      const cleanName = projectUid.trim();

      if (!cleanName) {
        console.log("Project Uid is empty");
        return;
      }

      const projectsRef = doc(firestore, "Projects", cleanName);
      await updateDoc(projectsRef, {
        uid: arrayUnion(userUid),
      });
      console.log("User added to project with ID:", cleanName);}
      catch (error) {
        console.error("Error adding user to project:", error);
      }
    }

  return (
    <form
      onSubmit={handleAddUser}
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={projectUid}
        onChange={(e) => setProjectUid(e.target.value)}
        placeholder="Enter project UID"
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #02063d",
          backgroundColor: "#271ea3",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Join Project
      </button>
    </form>
  );
}