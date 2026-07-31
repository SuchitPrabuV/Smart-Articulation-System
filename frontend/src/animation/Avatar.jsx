import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ALL_VISEMES, NEUTRAL, rocketboxMorphTargetForViseme } from './visemeMap';
import { frameAt } from './timeline';

export default function Avatar({ playRef, currentArpa, onFrame }) {
  const { scene, nodes } = useGLTF('/models/Business_Female_02_Facial.glb');
  const meshesRef = useRef([]);

  useEffect(() => {
    meshesRef.current = Object.values(nodes).filter((node) => node.morphTargetDictionary && node.morphTargetInfluences);
  }, [nodes]);

  function setViseme(name, weight) {
    const targetName = rocketboxMorphTargetForViseme(name);
    for (const mesh of meshesRef.current) {
      const index = mesh.morphTargetDictionary[targetName];
      if (index !== undefined) mesh.morphTargetInfluences[index] = weight;
    }
  }

  useFrame(() => {
    const state = playRef.current;
    if (!state || !state.timeline?.length) return;

    for (const viseme of ALL_VISEMES) {
      setViseme(viseme, 0);
    }

    if (!state.playing) {
      setViseme(NEUTRAL, 1);
      return;
    }

    const t = (performance.now() - state.startedAt) * (state.speed || 1);
    const { frame, next, progress } = frameAt(state.timeline, t);
    if (!frame) return;
    if (onFrame) onFrame(frame.arpa || 'sil');

    const FADE = 0.35;
    if (next && progress > 1 - FADE) {
      const k = (progress - (1 - FADE)) / FADE;
      setViseme(frame.viseme, 1 - k);
      setViseme(next.viseme, k);
    } else {
      setViseme(frame.viseme, 1);
    }
  });

  return <primitive object={scene} position={[0, -1.60, 0]} scale={1.1} />;
}

useGLTF.preload('/models/Business_Female_02_Facial.glb');
