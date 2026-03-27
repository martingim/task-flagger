import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export async function addUserToFirestore({
  uid,
  name,
  accessToProjects = [],
  skillsText = "",
  available = false,
}) {
  try {
    const userRef = doc(firestore, "Users", uid);
    const existingUser = await getDoc(userRef);

    if (existingUser.exists()) {
      console.log("User already exists in Firestore");
      return { alreadyExists: true };
    }

    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    await setDoc(userRef, {
      uid,
      name,
      accessToProjects,
      skills,
      available,
    });

    console.log("User added successfully");
    return { alreadyExists: false };
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}