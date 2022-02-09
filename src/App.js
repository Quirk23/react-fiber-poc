import React, { useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAspect, RoundedBox, Text, Billboard, Environment } from "@react-three/drei";
import { Intro } from "./Intro";
import * as THREE from 'three'
import { Flex, Box } from "@react-three/flex";
import { useSpring, animated } from '@react-spring/three'



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

const LayoutN = (props) => (
  [...Array(props.number)].map((e,i) => <Box grow={1} key={i}>
      <Scene />
     </Box>)
);

const Grid = () => (
  <Flex plane="xy" justifyContent="center" alignItems="center" flexDirection="column" position={[0,0,0]} size={[0.5,0.5,0]}>
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

const GridN = (props) => {
  const { size } = useThree();
  const [vpWidth, vpHeight] = useAspect(size.width, size.height);
  const vec = new THREE.Vector3();
  // useFrame(() =>
  //   group.current.position.lerp(vec.set(0, state.top / 100, 0), 0.1)
  // );
  const [counter, setCounter] = useState(props.number);
  const increment = () => (console.log(counter));
  const decrement = () => {setCounter(prevCounter => prevCounter - 1)};

  return (
    <Flex flexDirection="row"
        size={[vpWidth, vpHeight, 0]}
        //onReflow={handleReflow}
        justifyContent="space-evenly"
        position={[-vpWidth / 3, vpHeight / 4, 0]}
      >
      <Box dir="row" width="50%" height="100%" wrap="wrap">
        <LayoutN number={counter}/>
        <Button name="Increment" onClick={increment}/>
        <Button name="Decrement" onClick={decrement}/>
      </Box>
    </Flex>
  )
};


const Button = (props) => (
  <Box grow={1}>
    <Suspense>
      <RoundedBox args={[200,80, 0]} radius={5} smoothness={4} onClick={props.onClick}>
        <meshBasicMaterial color="royalblue" />
      </RoundedBox>
      <Text color="#f3f3f3" anchorX="center" anchorY="middle" fontSize={25}>
          {props.name}
      </Text>
    </Suspense>
  </Box>
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
  const size = useAspect(1280, 720, 0.15);
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

const Marquee = () => {

  const textRef = React.useRef();

  const props = useSpring({number: 0, from: {number: 20}});


  //console.log(textRef.current);
  useFrame( () => {
    const xPos = textRef.current.position.x;
    const textWidth = textRef.current.geometry.boundingBox.max.x;
    const offset = (textWidth !== Infinity)? textWidth : 0;
    textRef.current.position.x =  (xPos < -window.screen.width/2 - offset ) ? window.screen.width/2 + offset: xPos - 2.5;
  });

  const height = 100;
  const position = [0, -window.screen.height/2 + height, 0 ];
  return (
    <Suspense>
      <RoundedBox args={[window.screen.width, 80, 0]} radius={5} smoothness={4} position={position}>
          <meshBasicMaterial color="purple" />
        </RoundedBox>
      <Text ref={textRef} color="#f3f3f3" anchorY="middle" anchorX="center" fontSize={25} position={position}>
        Tune in at 5:00 pm EST every Wednesday.
        </Text>
      </Suspense>
  )
}
export default function App() {
  return (
    <Intro>
      <Canvas orthographic linear camera={{ position: [0, 0, 200] }}>
        <GridN number={6} />
        <Marquee/>
      </Canvas>
    </Intro>
  );
}
