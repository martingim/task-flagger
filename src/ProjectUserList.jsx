import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "./firebase";

export default function ProjectUserList({ uids = [] }) {
  const [users, setUsers] = useState([]);
  const [hoveredUid, setHoveredUid] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!uids.length) {
      setUsers([]);
      return;
    }

    setUsers([]);

    const unsubscribers = uids.map((uid) => {
      const userRef = doc(firestore, "Users", uid);

      return onSnapshot(
        userRef,
        (userSnap) => {
          if (!userSnap.exists()) {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.uid !== uid)
            );
            return;
          }

          const userData = {
            uid,
            ...userSnap.data(),
          };

          setUsers((prevUsers) => {
            const existingIndex = prevUsers.findIndex(
              (user) => user.uid === uid
            );

            if (existingIndex === -1) {
              return [...prevUsers, userData];
            }

            const updatedUsers = [...prevUsers];
            updatedUsers[existingIndex] = userData;
            return updatedUsers;
          });
        },
        (error) => {
          console.error(`Error listening to user ${uid}:`, error);
        }
      );
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [uids]);

  const orderedUsers = uids
    .map((uid) => users.find((user) => user.uid === uid))
    .filter(Boolean);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {orderedUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        orderedUsers.map((user) => (
          <div
            key={user.uid}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            onMouseEnter={() => setHoveredUid(user.uid)}
            onMouseLeave={() => setHoveredUid(null)}
            onMouseMove={(e) =>
              setTooltipPos({
                x: e.clientX + 12,
                y: e.clientY + 12,
              })
            }
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: user.available ? "#1db954" : "#666",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              👤
            </div>

            <span>{user.name || user.uid}</span>

            {hoveredUid === user.uid && (
              <div
                style={{
                  position: "fixed",
                  left: tooltipPos.x,
                  top: tooltipPos.y,
                  backgroundColor: "#1f1f1f",
                  color: "white",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  minWidth: "220px",
                  zIndex: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  pointerEvents: "none",
                }}
              >
                <div>
                  <strong>{user.name || "Unnamed user"}</strong>
                </div>
                <div style={{ marginTop: 6 }}>
                  Available: {user.available ? "Yes" : "No"}
                </div>
                <div style={{ marginTop: 6 }}>
                  Skills: {user.skills?.length ? user.skills.join(", ") : "None"}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}