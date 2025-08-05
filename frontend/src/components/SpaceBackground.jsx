import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import fragmentShader from "../shaders/BackgroundShader.frag?raw";
import vertexShader from "../shaders/BackgroundShader.vert?raw";

export default function SpaceBackground() {
  const materialRef = useRef();
  const meshRef = useRef();
  const { viewport } = useThree(); // ⬅️ responsiv storlek i world units

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <primitive
        object={
          new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
              uTime: { value: 0 },
            },
            side: THREE.DoubleSide,
          })
        }
        attach="material"
        ref={materialRef}
      />
    </mesh>
  );
}
