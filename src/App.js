import React, { useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useAspect, RoundedBox, Text, Billboard, Environment } from "@react-three/drei";
import { Intro } from "./Intro";
import * as THREE from 'three'
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
    <Box centerAnchor marginTop={20}>
      <Suspense>
        <RoundedBox args={[200, 80, 0]} radius={5} smoothness={4}>
          <meshBasicMaterial color="royalblue" />
        </RoundedBox>
        <Text color="#f3f3f3" anchorX="center" anchorY="middle" fontSize={25}>
          Vodcast
        </Text>
      </Suspense>
    </Box>
  </Flex>
);

function setupVideo() {
  const video = document.createElement('video');

  var playing = false;
  var timeupdate = false;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      /* use the stream */
      video.srcObject = stream;
    })
    .catch(function (err) {
      /* handle the error */
    });

  video.autoplay = true;
  video.muted = true;
  video.loop = true;

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener('playing', function () {
    playing = true;
    checkReady();
  }, true);

  video.addEventListener('timeupdate', function () {
    timeupdate = true;
    checkReady();
  }, true);

  // video.src = url;
  video.play();


  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }

  return video;
}

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
