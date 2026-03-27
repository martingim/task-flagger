import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "./firebase";

export default function CreateProject({ userUid }) {
  const [projectName, setProjectName] = useState("");

  async function handleAddProject(e) {
    e.preventDefault();

    try {
      if (!userUid) {
        console.log("No signed-in user");
        return;
      }

      const cleanName = projectName.trim();

      if (!cleanName) {
        console.log("Project name is empty");
        return;
      }

      const projectsRef = collection(firestore, "Projects");

      const newProject = {
        project_name: cleanName,
        uid: [userUid],
        created_at: serverTimestamp(),
      };

      const docRef = await addDoc(projectsRef, newProject);

      console.log("Project added with ID:", docRef.id);
      setProjectName("");
    } catch (error) {
      console.error("Error adding project:", error);
    }
  }

  return (
    <form
      onSubmit={handleAddProject}
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name"
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
        Create Project
      </button>
    </form>
  );
}