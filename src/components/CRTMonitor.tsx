import { Html } from '@react-three/drei';
import { OperatingSystem } from './os/OperatingSystem';

export function CRTMonitor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Monitor Casing */}
      <mesh castShadow>
        <boxGeometry args={[3.2, 2.6, 2.5]} />
        <meshStandardMaterial color="#e0dcd3" roughness={0.8} />
      </mesh>
      
      {/* Screen Bezel */}
      <mesh position={[0, 0, 1.26]}>
        <boxGeometry args={[2.9, 2.3, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* The Actual Screen / HTML Embed */}
      <mesh position={[0, 0, 1.32]}>
        <planeGeometry args={[2.8, 2.2]} />
        <meshBasicMaterial color="#000000" />
        <Html 
          transform 
          occlude="blending"
          distanceFactor={1.3}
          position={[0, 0, 0.01]}
          className="os-screen rounded-lg overflow-hidden"
          style={{ 
            width: '1024px', 
            height: '768px', 
            backgroundColor: '#001a1a',
            pointerEvents: 'auto'
          }}
        >
          <OperatingSystem />
        </Html>
      </mesh>
      
      {/* Monitor Stand */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.6, 0.9, 0.6, 16]} />
        <meshStandardMaterial color="#e0dcd3" />
      </mesh>
    </group>
  );
}
