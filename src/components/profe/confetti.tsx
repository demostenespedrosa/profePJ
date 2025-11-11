"use client";

import { useEffect, useState } from "react";

const colors = [
  "bg-yellow-400",
  "bg-pink-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-500",
];

const ConfettiPiece = ({ id }: { id: number }) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomX = Math.random() * 100;
    const randomDelay = Math.random() * 2;
    const randomDuration = 2 + Math.random() * 2;
    const randomSize = 8 + Math.random() * 8;
    const randomRotation = Math.random() * 360;

    setStyle({
      left: `${randomX}vw`,
      animationDelay: `${randomDelay}s`,
      animationDuration: `${randomDuration}s`,
      width: `${randomSize}px`,
      height: `${randomSize}px`,
      transform: `rotate(${randomRotation}deg)`,
    });
  }, [id]);

  return (
    <div
      style={style}
      className={`absolute top-0 opacity-0 animate-confetti-fall ${
        colors[id % colors.length]
      }`}
    />
  );
};

export default function Confetti() {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }, (_, i) => i);
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {pieces.map((i) => (
        <ConfettiPiece key={i} id={i} />
      ))}
    </div>
  );
}
