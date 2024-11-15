import Canvas from "./canvas";
import "./draw.css";
import { useRef } from "react";
import { MODES } from "./constants";
import { useWindowSize } from "./hooks";

export function Draw() {
  const settings = useRef({
    stroke: 3,
    color: "#ffffff",
    mode: MODES.PEN,
  });

  const size = useWindowSize();

  if (size.width === 0) {
    return <div>Loading...</div>;
  };

  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas {...size} settings={settings} />
      </div>
    </div>
  );
}