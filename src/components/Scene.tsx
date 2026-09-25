import { CRTMonitor } from './CRTMonitor';
import { Desk } from './Desk';

export function Scene() {
  return (
    <group position={[0, -1, 0]}>
      <Desk />
      <CRTMonitor position={[0, 1.25, 0]} />
    </group>
  );
}
