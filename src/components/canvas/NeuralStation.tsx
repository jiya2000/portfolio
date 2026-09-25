import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Scroll } from '@react-three/drei';
import * as THREE from 'three';

import CommandCenter from './CommandCenter';
import ServerCore from './ServerCore';
import DataPipeline from './DataPipeline';
import HumanMachineNexus from './HumanMachineNexus';

export default function NeuralStation() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // Scroll offset is between 0 and 1
    const offset = scroll.offset;
    
    // Move the camera along the Z axis (into the screen) and Y axis (downwards)
    // to simulate flying through the orbital station
    state.camera.position.z = THREE.MathUtils.lerp(10, -50, offset);
    state.camera.position.y = THREE.MathUtils.lerp(0, -20, offset);
    
    // Make the camera look slightly down
    state.camera.lookAt(0, state.camera.position.y - 2, state.camera.position.z - 5);
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />
      
      {/* Zone 1: Z = 0 */}
      <group position={[0, 0, 0]}>
        <CommandCenter />
      </group>

      {/* Zone 2: Z = -20, Y = -5 */}
      <group position={[0, -5, -20]}>
        <ServerCore />
      </group>

      {/* Zone 3: Z = -40, Y = -15 */}
      <group position={[0, -15, -40]}>
        <DataPipeline />
      </group>

      {/* Zone 4: Z = -60, Y = -25 */}
      <group position={[0, -25, -60]}>
        <HumanMachineNexus />
      </group>
      
      <Scroll html style={{ width: '100vw', height: '100vh' }}>
         <div className="absolute top-10 left-10 pointer-events-none">
            <h1 className="text-4xl font-bold tracking-widest text-white/50">AUTONOMOUS ORBITAL NEURAL STATION</h1>
            <p className="text-xl text-cyan-400 mt-2">Scroll to Navigate</p>
         </div>
      </Scroll>
    </group>
  );
}
