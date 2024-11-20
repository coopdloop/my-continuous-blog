// CosmicBackground.tsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

interface ParticleFieldProps {
  count?: number;
  speed?: number;
}

interface FloatingCircuitProps {
  color?: string;
  wireframe?: boolean;
  opacity?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 5000,
  speed = 1
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005 * speed;
      groupRef.current.rotation.x += 0.0002 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={100}
        depth={50}
        count={count}
        factor={4}
        saturation={0}
        fade
        speed={speed}
      />
    </group>
  );
};

const FloatingCircuit: React.FC<FloatingCircuitProps> = ({
  color = "#4a2075",
  wireframe = true,
  opacity = 0.1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time) * 0.2;
      meshRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[15, 15]} />
      <meshBasicMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
};

const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#030014']} />
        <ambientLight intensity={0.1} />
        <ParticleField />
        <FloatingCircuit />
      </Canvas>
    </div>
  );
};

export default CosmicBackground;
