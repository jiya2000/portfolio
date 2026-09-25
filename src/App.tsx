import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { createXRStore, XR } from '@react-three/xr';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import NeuralStation from './components/canvas/NeuralStation';

const store = createXRStore();

function App() {
  return (
    <div className="w-full h-screen relative bg-[#03040c]">
      {/* AR Button Overlay */}
      <div className="absolute bottom-10 right-10 z-50 flex gap-4">
        <button 
          onClick={() => store.enterAR()}
          className="px-6 py-3 bg-cyan-600/50 hover:bg-cyan-500 border border-cyan-400 text-white rounded-full font-bold uppercase tracking-widest backdrop-blur-md transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)] cursor-pointer"
        >
          Enter WebXR
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <XR store={store}>
          <ScrollControls pages={4} damping={0.2}>
            <NeuralStation />
          </ScrollControls>
          
          <EffectComposer>
            <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          </EffectComposer>
        </XR>
      </Canvas>
    </div>
  );
}

export default App;
