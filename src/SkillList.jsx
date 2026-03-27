import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { firestore } from "./firebase";

export default function SkillList({ userUid, skills = [], loading = false }) {
  async function removeSkill(skillToRemove) {
    try {
      if (!userUid) {
        console.log("No signed-in user");
        return;
      }

      const userRef = doc(firestore, "Users", userUid);

      await updateDoc(userRef, {
        skills: arrayRemove(skillToRemove),
      });
    } catch (error) {
      console.error("Error removing skill:", error);
    }
  }

  if (loading) {
    return <p>Loading skills...</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        skills.map((skill) => (
          <div
            key={skill}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #02063d",
                backgroundColor: "#271ea3",
                color: "white",
                textAlign: "left",
                minWidth: "160px",
              }}
            >
              {skill}
            </button>

            <button
              onClick={() => removeSkill(skill)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #7a0000",
                backgroundColor: "#c62828",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              -
            </button>
          </div>
        ))
      )}
    </div>
  );
}