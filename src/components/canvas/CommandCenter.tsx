import { Html, Text } from '@react-three/drei';


export default function CommandCenter() {
  return (
    <group>
      {/* Viewport ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[10, 0.2, 16, 100]} />
        <meshStandardMaterial color="#00ffff" wireframe />
      </mesh>

      {/* Holographic Earth Placeholder */}
      <mesh position={[0, 0, -10]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial color="#003366" wireframe />
      </mesh>

      {/* Content */}
      <Html position={[0, 2, 0]} center transform className="html-overlay">
        <div className="bg-black/50 p-8 border border-cyan-500 rounded-xl backdrop-blur-md text-center shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Aditi Sharma
          </h1>
          <h2 className="text-xl text-cyan-200 mt-2 font-mono">INTEGRATED M.TECH CSE (DATA SCIENCE) @ VIT</h2>
          <div className="mt-4 flex gap-4 justify-center">
            <a href="https://github.com/aditisharma" className="px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">GITHUB</a>
            <a href="https://linkedin.com/in/aditisharma" className="px-4 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all">LINKEDIN</a>
          </div>
        </div>
      </Html>

      {/* Telemetry data projection */}
      <Text position={[-6, 0, -5]} color="#00ffff" fontSize={0.5} rotation={[0, Math.PI / 4, 0]}>
        GCS TELEMETRY
        {'\n'}ALT: 3200m
        {'\n'}VEL: 124 m/s
      </Text>
      
      <Text position={[6, 0, -5]} color="#00ffff" fontSize={0.5} rotation={[0, -Math.PI / 4, 0]}>
        GITHUB LIVE
        {'\n'}COMMITS: 1,402
        {'\n'}STATUS: ACTIVE
      </Text>
    </group>
  );
}
