"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://levelupyourshow-backend-production.up.railway.app");

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [pollingActive, setPollingActive] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  const startPolling = () => {
    socket.emit("start-polling", {
      user: session?.user?.email
    });
    setPollingActive(true);
  };

  const stopPolling = () => {
    socket.emit("stop-polling", {
      user: session?.user?.email
    });
    setPollingActive(false);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Login sebagai: {session.user?.email}</p>

      <hr style={{ margin: "16px 0" }} />

      <p>
        Status Polling:{" "}
        <strong>{pollingActive ? "AKTIF" : "TIDAK AKTIF"}</strong>
      </p>

      {!pollingActive ? (
        <button
          onClick={startPolling}
          style={{
            padding: "8px 16px",
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Start Polling
        </button>
      ) : (
        <button
          onClick={stopPolling}
          style={{
            padding: "8px 16px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Stop Polling
        </button>
      )}
    </div>
  );
}
