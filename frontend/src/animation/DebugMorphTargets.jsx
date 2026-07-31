import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export default function DebugMorphTargets() {
  const { nodes } = useGLTF('/models/Business_Female_02_Facial.glb');
  const entries = useMemo(() => Object.entries(nodes).filter(([, node]) => node.morphTargetDictionary && node.morphTargetInfluences), [nodes]);
  entries.forEach(([name, node]) => {
    console.log(name, Object.keys(node.morphTargetDictionary));
  });
  return null;
}
