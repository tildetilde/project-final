import { Canvas } from "@react-three/fiber";
import SpaceBackground from "./components/SpaceBackground";

export const App = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 1] }}>
        <SpaceBackground />
      </Canvas>
    </div>
  );
};
