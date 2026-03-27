import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export async function loadUsersByUids(uids) {
  try {
    const userPromises = uids.map(async (uid) => {
      const userRef = doc(firestore, "Users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return {
          uid,
          name: "Unknown user",
          skills: [],
          available: false,
        };
      }

      return {
        uid,
        ...userSnap.data(),
      };
    });

    const users = await Promise.all(userPromises);
    return users;
  } catch (error) {
    console.error("Error loading users by UIDs:", error);
    return [];
  }
}