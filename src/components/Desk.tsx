export function Desk() {
  return (
    <mesh position={[0, 0.5, 0]} receiveShadow>
      <boxGeometry args={[12, 1, 6]} />
      <meshStandardMaterial color="#2d1b11" roughness={0.9} />
    </mesh>
  );
}
