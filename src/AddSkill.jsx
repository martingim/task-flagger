import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "./firebase";

export default function AddSkillField({ userUid }) {
  const [skillText, setSkillText] = useState("");

  async function handleAddSkill(e) {
    if (e) e.preventDefault();

    try {
      if (!userUid) {
        console.log("No signed-in user");
        return;
      }

      const cleanSkill = skillText.trim();

      if (!cleanSkill) {
        console.log("Skill is empty");
        return;
      }

      const userRef = doc(firestore, "Users", userUid);

      await updateDoc(userRef, {
        skills: arrayUnion(cleanSkill),
      });

      console.log("Skill added successfully");
      setSkillText("");
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  }

  return (
    <form onSubmit={handleAddSkill} style={{ marginTop: 20 }}>
      <input
        type="text"
        value={skillText}
        onChange={(e) => setSkillText(e.target.value)}
        placeholder="Enter a skill"
        style={{
          padding: "8px",
          marginRight: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #02063d",
          backgroundColor: "#271ea3",
          color: "white",
          cursor: "pointer",
        }}
      >
        Add Skill
      </button>
    </form>
  );
}