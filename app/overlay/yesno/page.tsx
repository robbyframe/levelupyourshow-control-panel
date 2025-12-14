"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";


export default function YesNoDonutOverlay() {
  const [yesPercent, setYesPercent] = useState(0);
const [frozen, setFrozen] = useState(false);

const frozenRef = useRef(false);


  // ukuran broadcast
  const radius = 180;
  const strokeWidth = 96;
  const circumference = 2 * Math.PI * radius;

  const yesOffset = circumference * (1 - yesPercent / 100);
const socketRef = useRef<any>(null);

useEffect(() => {
  const socket = io("https://levelupyourshow-backend-production.up.railway.app");
  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("Overlay connected");
  });

  socket.on("polling:reset", () => {
    frozenRef.current = false;
    setFrozen(false);
    setYesPercent(0);
  });

  socket.on("polling:freeze", () => {
    frozenRef.current = true;
    setFrozen(true);
  });

  socket.on("polling:update", (data: { yesPercent: number }) => {
    if (frozenRef.current) return;
    setYesPercent(data.yesPercent);
  });

  return () => {
    socket.disconnect(); // 🔥 INI KUNCI UTAMA
  };
}, []);

  return (
    <div
  style={{
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    background: "transparent", // 🔑 LIVE = TRANSPARENT
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "white",
  }}
>

      {/* LEFT TEXT */}
      <div style={{ position: "absolute", left: 200, textAlign: "right" }}>
        <div style={{ fontSize: 28, opacity: 0.7 }}>YA</div>
        <div style={{ fontSize: 72, fontWeight: 600 }}>
          {yesPercent}%
        </div>
      </div>

      {/* RIGHT TEXT */}
      <div style={{ position: "absolute", right: 200 }}>
        <div style={{ fontSize: 28, opacity: 0.7 }}>TIDAK</div>
        <div style={{ fontSize: 72, fontWeight: 600 }}>
          {100 - yesPercent}%
        </div>
      </div>

      {/* DONUT */}
      <svg width="560" height="560">
        {/* BASE (TIDAK / SISA) */}
        <circle
          cx="280"
          cy="280"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={strokeWidth}
          strokeDasharray="28 18"
          strokeLinecap="round"
        />

        {/* YES */}
        <circle
          cx="280"
          cy="280"
          r={radius}
          fill="transparent"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeDasharray="28 18"
          strokeDashoffset={yesOffset}
          strokeLinecap="round"
          transform="rotate(-90 280 280)"
          style={{
            transition: "stroke-dashoffset 0.9s ease-out",
          }}
        />
      </svg>
    </div>
  );
}
