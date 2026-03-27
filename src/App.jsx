import "./App.css";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import ProjectTabs from "./ProjectTabs";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import AddSkillField from "./AddSkill";
import CreateProject from "./CreateProject";
import AddUserToProject from "./AddUserToProject";
import AvailabilityToggle from "./AvailableToggle";
import SkillList from "./SkillList";

import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function App() {
  const [user] = useAuthState(auth);
  const [userDoc, setUserDoc] = useState(null);
  const [userDocLoading, setUserDocLoading] = useState(false);

  console.log("Current user:", user?.displayName || "No user signed in");

  useEffect(() => {
    if (!user) {
      setUserDoc(null);
      setUserDocLoading(false);
      return;
    }

    setUserDocLoading(true);

    const userRef = doc(firestore, "Users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          setUserDoc({
            id: snap.id,
            ...snap.data(),
          });
        } else {
          setUserDoc(null);
        }
        setUserDocLoading(false);
      },
      (error) => {
        console.error("Error loading current user document:", error);
        setUserDoc(null);
        setUserDocLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div>
      <h1>Help Flagger {user ? <AvailabilityToggle
                    userUid={user.uid}
                    available={userDoc?.available ?? false}
                  /> : null}</h1>

      {user ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ProjectTabs uid={user.uid} />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                minWidth: "250px",
              }}
            >
              {userDocLoading ? (
                <p>Loading user data...</p>
              ) : (
                
                <>
                  <AddUserToProject userUid={user.uid} />
                  <CreateProject userUid={user.uid} />  

                  <h2>My Skills</h2>

                  <SkillList
                    userUid={user.uid}
                    skills={userDoc?.skills ?? []}
                    loading={userDocLoading}
                  />
                  
                  <AddSkillField userUid={user.uid} />
                </>
              )}
            </div>
          </div>

          <SignOutButton />
        </>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}