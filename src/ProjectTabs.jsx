import { useEffect, useRef, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "./firebase";
import ProjectUserList from "./ProjectUserList";

export default function ProjectTabs({ uid }) {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!uid) {
      setTabs([]);
      setActiveTabId(null);
      return;
    }

    const projectsRef = collection(firestore, "Projects");
    const q = query(projectsRef, where("uid", "array-contains", uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newTabs = snapshot.docs.map((docSnap) => {
          const project = {
            id: docSnap.id,
            ...docSnap.data(),
          };

          return {
            id: project.id,
            label: project.project_name,
            content: <ProjectUserList uids={project.uid || []} />,
          };
        });

        setTabs(newTabs);

        if (newTabs.length === 0) {
          setActiveTabId(null);
          return;
        }

        setActiveTabId((prevActiveTabId) => {
          const stillExists = newTabs.some((tab) => tab.id === prevActiveTabId);
          return stillExists ? prevActiveTabId : newTabs[0].id;
        });
      },
      (error) => {
        console.error("Error listening to project tabs:", error);
        setTabs([]);
        setActiveTabId(null);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  async function removeActiveProject() {
    try {
      if (!activeTabId) {
        console.log("No active project selected");
        return;
      }

      const confirmed = window.confirm("Delete this project?");
      if (!confirmed) return;

      const projectRef = doc(firestore, "Projects", activeTabId);
      await deleteDoc(projectRef);

      setMenuOpen(false);
      setToastMessage("Project deleted");

      setTimeout(() => {
        setToastMessage("");
      }, 2000);

      console.log("Project deleted:", activeTabId);
    } catch (error) {
      console.error("Error deleting project:", error);
      setMenuOpen(false);
      setToastMessage("Failed to delete project");

      setTimeout(() => {
        setToastMessage("");
      }, 2000);
    }
  }

  async function inviteActiveProject() {
  try {
    if (!activeTabId || typeof activeTabId !== "string") {
      console.log("No valid active project selected");
      return null;
    }

    await navigator.clipboard.writeText(activeTabId);

    setMenuOpen(false);
    setToastMessage("Project ID copied to clipboard");

    setTimeout(() => {
      setToastMessage("");
    }, 2000);

    console.log("Project UID copied to clipboard:", activeTabId);
    return activeTabId;
  } catch (error) {
    console.error("Error inviting project:", error);

    setMenuOpen(false);
    setToastMessage("Failed to copy project ID");

    setTimeout(() => {
      setToastMessage("");
    }, 2000);

    return null;
  }
}

async function leaveActiveProject() {
  try {
    if (!activeTabId || typeof activeTabId !== "string") {
      console.log("No valid active project selected");
      return null;
    }
    const confirmed = window.confirm("Leave this project?");
      if (!confirmed) return;
    
    const projectRef = doc(firestore, "Projects", activeTabId);
      await updateDoc(projectRef, {
        uid: arrayRemove(uid),
      });

    setMenuOpen(false);


    console.log("Left project:", activeTabId);
    return activeTabId;
    } 
  catch (error) {
        console.error("Error leaving project:", error);
    setMenuOpen(false);
    setToastMessage("Failed to leave project");

    return null;
  }
}

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 10,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            style={{
              padding: "8px 12px",
              border: "1px solid #02063d",
              borderRadius: "6px",
              backgroundColor: activeTabId === tab.id ? "#1dbcc7" : "#271ea3",
              color: "#ffffff",
              fontWeight: activeTabId === tab.id ? "bold" : "normal",
              cursor: "pointer",
              textAlign: "left",
              minWidth: "180px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              position: "relative",
            }}
            ref={menuRef}
          >
            <h2 style={{ margin: 0 }}>{activeTab.label}</h2>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              title="Project settings"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "22px",
              }}
            >
              ⚙
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "42px",
                  left: "0",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  minWidth: "180px",
                  zIndex: 20,
                  padding: "6px 0",
                }}
              >
                <button
                  onClick={inviteActiveProject}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 14px",
                    border: "none",
                    backgroundColor: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#000000",
                    fontWeight: "bold",
                  }}
                >
                  Invite to project
                </button>
                

                <button
                  onClick={leaveActiveProject}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 14px",
                    border: "none",
                    backgroundColor: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#000000",
                    fontWeight: "bold",
                  }}
                >
                  Leave project
                </button>

                <button
                  onClick={removeActiveProject}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 14px",
                    border: "none",
                    backgroundColor: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    color: "#c62828",
                    fontWeight: "bold",
                  }}
                >
                  Delete project
                </button>

                {/* Add more settings here later
                <button style={menuItemStyle}>Rename project</button>
                <button style={menuItemStyle}>Manage members</button>
                */}
              </div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>{activeTab.content}</div>
        </div>
      )}

      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#1f1f1f",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            zIndex: 1000,
            fontSize: "14px",
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}