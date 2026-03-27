import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export default function AvailabilityToggle({ userUid, available }) {
  async function toggleAvailability() {
    try {
      if (!userUid) {
        console.log("No signed-in user");
        return;
      }

      const newValue = !available;
      const userRef = doc(firestore, "Users", userUid);

      await updateDoc(userRef, {
        available: newValue,
      });
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  }

  return (
    <button
      onClick={toggleAvailability}
      style={{
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        color: "white",
        fontWeight: "bold",
        backgroundColor: available ? "green" : "gray",
        marginBottom: "16px",
      }}
    >
      {available ? "Available" : "Unavailable"}
    </button>
  );
}