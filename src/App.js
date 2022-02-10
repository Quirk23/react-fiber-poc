import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useCursor, RoundedBox, Text, Billboard, Environment, GradientTexture, MeshDistortMaterial } from "@react-three/drei";
import { Intro } from "./Intro";
import * as THREE from 'three'
import { Flex, Box } from "@react-three/flex";
import { useSpring, animated } from '@react-spring/three'

function Flag(props) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame(() => {
    ref.current.distort = THREE.MathUtils.lerp(ref.current.distort, hovered ? 0.4 : 0, hovered ? 0.05 : 0.01)
  })
  return (
    <mesh onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} onClick={props.onClick} scale={[100, 100, 1]}>
        <planeGeometry args={[1, 1, 10, 10]} />
      <MeshDistortMaterial ref={ref} speed={5}>
        <GradientTexture stops={[0, 0.8, 1]} colors={['#e63946', '#f1faee', '#a8dadc']} size={200} />
      </MeshDistortMaterial>
      <Text color="#f3f3f3" anchorX="center" anchorY="middle" fontSize={0.2}>
        {props.name}
      </Text>
    </mesh>
  )
}
const LayoutN = (props) => (
  [...Array(props.number)].map((e,i) => <Box grow={1} key={i}>
      <Scene />
     </Box>)
);

const GridN = (props) => {
  const { size } = useThree();
  const [vpWidth, vpHeight] = useAspect(size.width, size.height);
  const vec = new THREE.Vector3();
  const [counter, setCounter] = useState(props.number);
  const increment = () => (setCounter(prevCounter => prevCounter + 1));
  const decrement = () => (setCounter(prevCounter => prevCounter - 1));

  return (
    <Flex flexDirection="row"
        size={[vpWidth, vpHeight, 0]}
        justifyContent="space-evenly"
        position={[-vpWidth / 3, vpHeight / 4, 0]}
      >
      <Box dir="row" width="50%" height="100%" wrap="wrap">
        <LayoutN number={counter}/>
            </Box>
      <Button name="Increment" onClick={(event) => increment()}/>
      <Button name="Decrement" onClick={(event) => decrement()}/>
    </Flex>
  )
};


const Button = (props) => (
  <Box grow={1}>
    <Suspense>
      <RoundedBox args={[200,80, 0]} radius={20} smoothness={4} onClick={props.onClick}>
        <meshBasicMaterial>
          <GradientTexture stops={[0,1]} colors={['#ff0000', '#00ff00']} size={500} />
        </meshBasicMaterial>
      </RoundedBox>
      <Text color="#f3f3f3" anchorX="center" anchorY="middle" fontSize={25}>
        {props.name}
      </Text>
    </Suspense>
  </Box>
);

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
        <Stats showPanel={0} className="stats" {...props} />
        <GridN number={6} />
        <Marquee/>
      </Canvas>
    </Intro>
  );
}
