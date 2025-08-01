// src/components/common/ModelViewer.jsx

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei';

// This component loads and displays the 3D model
function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

const ModelViewer = ({ modelPath }) => {
  return (
    <div className="w-full h-full aspect-[3/4] bg-muted rounded-lg cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} camera={{ fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model modelPath={modelPath} />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;