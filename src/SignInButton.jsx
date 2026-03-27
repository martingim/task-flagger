import { signInWithPopup} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import {addUserToFirestore} from "./AddUser";

export default function SignInButton() {
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Signed in user:", result.user);
        await addUserToFirestore({
          uid: result.user.uid,
          name: result.user.displayName,
        });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  }


  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}