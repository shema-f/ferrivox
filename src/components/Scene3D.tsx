import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import CameraRig from "./CameraRig";
import HQScene from "./scenes/HQScene";
import DataFloor from "./scenes/DataFloor";
import SoftwareFloor from "./scenes/SoftwareFloor";
import SecurityFloor from "./scenes/SecurityFloor";
import AIFloor from "./scenes/AIFloor";
import ProjectDistrict from "./scenes/ProjectDistrict";
import GlobalNetwork from "./scenes/GlobalNetwork";
import CommandCenter from "./scenes/CommandCenter";
import type { SceneId } from "../types";

interface Scene3DProps {
  sceneId: SceneId;
}

function SceneContent({ sceneId }: Scene3DProps) {
  return (
    <>
      <CameraRig sceneId={sceneId} />

      {/* Global fog */}
      <fog attach="fog" args={["#050810", 60, 160]} />

      {/* Global ambient */}
      <ambientLight color="#030508" intensity={0.3} />

      {/* All scenes at their world positions */}
      <HQScene position={[0, 0, 0]} />
      <DataFloor position={[-200, 0, 0]} />
      <SoftwareFloor position={[200, 0, 0]} />
      <SecurityFloor position={[0, 0, -200]} />
      <AIFloor position={[-400, 0, 0]} />
      <ProjectDistrict position={[400, 0, 0]} />
      <GlobalNetwork position={[0, 0, -400]} />
      <CommandCenter position={[0, 0, 200]} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.85}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

export default function Scene3D({ sceneId }: Scene3DProps) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false }}
      camera={{
        position: [0, 10, 44],
        fov: 58,
        near: 0.1,
        far: 2500,
      }}
      dpr={[1, 2]}
      shadows={false}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContent sceneId={sceneId} />
      </Suspense>
    </Canvas>
  );
}
