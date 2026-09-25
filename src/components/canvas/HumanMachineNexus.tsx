import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Procedural noise displacement to simulate fluid movement (Kathak)
    pos.x += sin(pos.y * 5.0 + uTime) * 0.1;
    pos.z += cos(pos.x * 5.0 + uTime) * 0.1;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (10.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    gl_FragColor = vec4(0.0, 1.0, 0.5, 1.0 - (dist * 2.0));
  }
`;

export default function HumanMachineNexus() {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  
  // Generate a cylinder-like point cloud to represent the dancer
  const particles = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(1, 2, 6, 32, 32);
    return geometry;
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group>
      <Html position={[0, 5, 0]} center transform className="html-overlay">
        <div className="text-center w-[600px]">
          <h2 className="text-3xl font-bold text-white tracking-widest uppercase bg-black/50 px-6 py-3 border-l-4 border-green-500 backdrop-blur-sm">
            Human-Machine Nexus
          </h2>
          <p className="text-green-300 mt-2 font-mono">Kathak Dance & NDA Discipline (AIR 417)</p>
        </div>
      </Html>

      <points ref={pointsRef} geometry={particles}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 }
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
