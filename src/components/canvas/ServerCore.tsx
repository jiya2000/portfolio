import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Drone = ({ position, color, label }: { position: [number, number, number], color: string, label: string }) => {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5;
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position} ref={group}>
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color={color} opacity={0.8} transparent />
      </mesh>
      <Html position={[0, 1.5, 0]} center className="html-overlay">
        <div className="bg-black/80 px-4 py-2 border border-white/20 rounded text-sm whitespace-nowrap text-white font-mono shadow-[0_0_10px_currentColor]" style={{ color }}>
          {label} Agent
        </div>
      </Html>
    </group>
  );
};

export default function ServerCore() {
  return (
    <group>
      {/* Orbital Kubernetes Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[15, 1, 32, 100]} />
        <meshStandardMaterial color="#333344" roughness={0.2} metalness={0.8} />
      </mesh>

      <Html position={[0, 5, -10]} center transform className="html-overlay">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-widest uppercase bg-black/50 px-6 py-3 border-l-4 border-purple-500 backdrop-blur-sm">
            HCLTech Software Engineering Intern
          </h2>
          <p className="text-purple-300 mt-2 font-mono">Enterprise Multi-Agent Cloud Operations Platform</p>
        </div>
      </Html>

      {/* 3 AI Agents */}
      <Drone position={[-8, 0, -5]} color="#ff00ff" label="FinOps" />
      <Drone position={[0, 0, -8]} color="#00ff00" label="Security" />
      <Drone position={[8, 0, -5]} color="#ffff00" label="Operations" />
    </group>
  );
}
