import { useEffect, useRef } from "react";

export default function Starfield({ boost }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * w - w / 2,
      y: Math.random() * h - h / 2,
      z: Math.random() * w
    }));

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      for (let star of stars) {
        star.z -= boost ? 20 : 2; // 🚀 boost speed when launching
        if (star.z <= 0) {
          star.x = Math.random() * w - w / 2;
          star.y = Math.random() * h - h / 2;
          star.z = w;
        }

        const k = 128.0 / star.z;
        const sx = star.x * k + w / 2;
        const sy = star.y * k + h / 2;

        if (sx >= 0 && sx <= w && sy >= 0 && sy <= h) {
          const size = (1 - star.z / w) * 2;
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
  }, [boost]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: -1, pointerEvents: "none" }}
    />
  );
}
