import { signOut } from "firebase/auth"; 
import { auth } from "./firebase";


export default function SignOutButton() {
  async function logOut() {
    try {
      await signOut(auth);
      console.log("Signed out");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  }

  return (
    <button onClick={logOut} 
    style={{ 
      posittion: "fixed",
      bottom: "20px",
      right: "20px"
     }}>
      Sign out
    </button>
  );
}