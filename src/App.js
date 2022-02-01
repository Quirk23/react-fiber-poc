import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useAspect } from "@react-three/drei";
import { Intro } from "./Intro";

import { Flex, Box } from "@react-three/flex";

const Layout = () => (
  <Flex justifyContent="center" alignItems="center" flexDirection="row">
    <Box centerAnchor>
      <Scene />
    </Box>
    <Box centerAnchor marginLeft={20} flexGrow={1}>
      <Scene />
    </Box>
  </Flex>
);

const Grid = () => (
    <Flex justifyContent="center" alignItems="center" flexDirection="Column">
    <Box centerAnchor>
      <Layout />
    </Box>
    <Box centerAnchor flexGrow={1} marginTop={20}>
      <Layout />
    </Box>
  </Flex>
);

function Scene() {
  const size = useAspect(1280, 720, 0.3);
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = "/10.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    return vid;
  });
  //const [texture] = use
  // Keep in mind videos can only play once the user has interacted with the site ...
  useEffect(() => void video.play(), [video]);
  return (
    <mesh scale={size}>
      <planeBufferGeometry />
      <meshBasicMaterial>
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </mesh>
  );
}

export default function App() {
  return (
    <Intro>
      <Canvas orthographic linear camera={{ position: [0, 0, 200] }}>
        <Grid />
      </Canvas>
    </Intro>
  );
}
