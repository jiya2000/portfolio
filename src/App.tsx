import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Scanline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Scene } from './components/Scene';
import * as THREE from 'three';

export default function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        <CameraControls 
          maxPolarAngle={Math.PI / 2 + 0.1} 
          minDistance={2} 
          maxDistance={10}
          makeDefault 
        />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
        
        <Scene />

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.8} />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(0.002, 0.002)} 
          />
          <Scanline blendFunction={BlendFunction.OVERLAY} density={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
