import { firestore } from "./firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

async function loadUserProjects(uid) {
  try {
    if (!uid) {
      console.log("No uid provided to loadUserProjects");
      return [];
    }

    console.log("loadUserProjects called with uid:", uid);
    console.log("uid type:", typeof uid);

    const projectsRef = collection(firestore, "Projects");
    const q = query(projectsRef, where("uid", "array-contains", uid));

    const snapshot = await getDocs(q);

    console.log("snapshot empty:", snapshot.empty);
    console.log("snapshot size:", snapshot.size);

    snapshot.forEach((doc) => {
      console.log("Project document:", doc.id, doc.data());
    });

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Mapped projects:", projects);

    return projects;
  } catch (error) {
    console.error("Error loading user projects:", error);
    return [];
  }
}

export { loadUserProjects };