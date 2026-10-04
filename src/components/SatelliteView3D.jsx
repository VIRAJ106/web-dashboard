import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Sphere, Box, Cylinder, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Satellite model that rotates to face the target
const Satellite = ({ position, targetPos, scenario, scale = 1 }) => {
  const ref = useRef();
  const dummy = new THREE.Object3D();

  useFrame(() => {
    if (ref.current) {
      // Look at the beacon very smoothly
      dummy.position.set(...position);
      dummy.lookAt(new THREE.Vector3(...targetPos));
      ref.current.quaternion.slerp(dummy.quaternion, 0.02);
    }
  });

  // Base materials that change based on environment lighting
  const isUAV = scenario === 'UAV-2km';
  const bodyColor = isUAV ? '#475569' : '#F59E0B'; // Gold foil for space, dark grey for UAV/Drone
  const panelColor = isUAV ? '#0f172a' : '#1E40AF'; // Deep blue solar panels

  return (
    <group position={position} ref={ref} scale={scale}>
      {/* Central Body (Gold Foil MLI in space) */}
      <Box args={[1.5, 1.5, 1.5]} castShadow>
        <meshStandardMaterial color={bodyColor} metalness={isUAV ? 0.6 : 0.4} roughness={isUAV ? 0.3 : 0.7} />
      </Box>
      {/* Top/Bottom Metallic Caps */}
      <Cylinder args={[0.6, 0.6, 1.6, 16]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </Cylinder>
      
      {/* Solar Panel Left */}
      <group position={[-3, 0, 0]}>
        {/* Support Arm */}
        <Cylinder args={[0.1, 0.1, 1.5]} rotation={[0, 0, Math.PI/2]} position={[1, 0, 0]}>
           <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </Cylinder>
        {/* Panel Array */}
        <Box args={[3.5, 0.05, 1.5]} castShadow>
          <meshStandardMaterial color={panelColor} metalness={0.8} roughness={0.2} />
        </Box>
        {/* Panel Grid Lines */}
        <gridHelper args={[3.5, 10, '#38bdf8', '#38bdf8']} position={[0, 0.03, 0]} />
      </group>
      
      {/* Solar Panel Right */}
      <group position={[3, 0, 0]}>
        {/* Support Arm */}
        <Cylinder args={[0.1, 0.1, 1.5]} rotation={[0, 0, Math.PI/2]} position={[-1, 0, 0]}>
           <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </Cylinder>
        {/* Panel Array */}
        <Box args={[3.5, 0.05, 1.5]} castShadow>
          <meshStandardMaterial color={panelColor} metalness={0.8} roughness={0.2} />
        </Box>
        <gridHelper args={[3.5, 10, '#38bdf8', '#38bdf8']} position={[0, 0.03, 0]} />
      </group>

      {/* Optical Terminal Base */}
      <Cylinder args={[0.4, 0.6, 0.5]} position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.4} />
      </Cylinder>
      {/* Emitter Lens */}
      <Cylinder args={[0.3, 0.3, 0.2]} position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#000" metalness={1} roughness={0} />
      </Cylinder>
    </group>
  );
};

const RealisticMoon = () => {
  const moonMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');
  return (
    <Sphere args={[3, 64, 64]} position={[-40, 20, -60]} rotation={[0, 1.5, 0]}>
      <meshBasicMaterial map={moonMap} color="#e2e8f0" />
    </Sphere>
  );
};

const RealisticEarth = ({ scenario }) => {
  // Using a robust, public earth texture
  const earthMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
  
  const isGeo = scenario === 'GEO-36K';
  const pos = isGeo ? [-20, -10, -60] : [0, -35, 0];
  const scale = isGeo ? 0.3 : 1;

  return (
    <Sphere args={[30, 64, 64]} position={pos} scale={scale} rotation={[0.2, -Math.PI / 2, 0]}>
      <meshStandardMaterial map={earthMap} metalness={0.4} roughness={0.6} />
    </Sphere>
  );
};

const RotatingWorld = ({ scenario, children }) => {
  const ref = useRef();
  useFrame((_, delta) => {
    if (scenario === 'LEO-500' && ref.current) {
      ref.current.rotation.y += delta * 0.4;
    }
  });
  return <group ref={ref}>{children}</group>;
};

// Animated Quadcopter Drone Model for UAV scenario
const DroneModel = ({ color }) => {
  const r1 = useRef();
  const r2 = useRef();
  const r3 = useRef();
  const r4 = useRef();

  useFrame((state, delta) => {
    // High-speed rotor spin
    const spin = delta * 30;
    if (r1.current) r1.current.rotation.y += spin;
    if (r2.current) r2.current.rotation.y -= spin;
    if (r3.current) r3.current.rotation.y -= spin;
    if (r4.current) r4.current.rotation.y += spin;
  });

  return (
    <group scale={0.8}>
      {/* Main Body */}
      <Box args={[1.2, 0.4, 1.2]} radius={0.1} castShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </Box>
      <Box args={[1.4, 0.1, 1.4]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Box>

      {/* Carbon Fiber Arms */}
      <group rotation={[0, Math.PI / 4, 0]}>
        <Box args={[3.5, 0.1, 0.2]} castShadow>
          <meshStandardMaterial color="#334155" />
        </Box>
        <Box args={[0.2, 0.1, 3.5]} castShadow>
          <meshStandardMaterial color="#334155" />
        </Box>
      </group>

      {/* Rotors */}
      <Cylinder ref={r1} args={[0.7, 0.7, 0.02, 16]} position={[1.23, 0.2, 1.23]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </Cylinder>
      <Cylinder ref={r2} args={[0.7, 0.7, 0.02, 16]} position={[-1.23, 0.2, 1.23]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </Cylinder>
      <Cylinder ref={r3} args={[0.7, 0.7, 0.02, 16]} position={[1.23, 0.2, -1.23]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </Cylinder>
      <Cylinder ref={r4} args={[0.7, 0.7, 0.02, 16]} position={[-1.23, 0.2, -1.23]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </Cylinder>

      {/* Optical Payload / Beacon */}
      <Sphere args={[0.3]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Sphere>
      <pointLight color={color} intensity={1} distance={10} position={[0, -0.5, 0]} />
    </group>
  );
};

// Simple glowing sphere for optical beacons (as requested)
const HardwareBeacon = ({ color, sizeScale = 1, innerRef }) => {
  return (
    <group ref={innerRef} scale={sizeScale}>
      <Sphere args={[0.5]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} wireframe />
      </Sphere>
      <pointLight color={color} intensity={1.5} distance={15} />
    </group>
  );
};

// Distraction beacons for ISRO-LEO-SIH scenario
const MultiBeacons = () => {
  const b1 = useRef();
  const b2 = useRef();
  const b3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (b1.current) b1.current.position.set(Math.sin(t * 0.25) * 5, Math.cos(t * 0.3) * 4, Math.sin(t * 0.15) * 3);
    if (b2.current) b2.current.position.set(Math.cos(t * 0.2) * 6, Math.sin(t * 0.4) * 3, Math.cos(t * 0.25) * -4);
    if (b3.current) b3.current.position.set(Math.sin(t * 0.3 + 2) * -5, Math.cos(t * 0.2 + 1) * -3, Math.sin(t * 0.35) * 5);
  });

  return (
    <group>
      {/* BEACON-02: Blue */}
      <HardwareBeacon innerRef={b1} color="#3B82F6" sizeScale={0.8} />
      {/* BEACON-03: Amber */}
      <HardwareBeacon innerRef={b2} color="#F59E0B" sizeScale={0.8} />
      {/* BEACON-04: Pink */}
      <HardwareBeacon innerRef={b3} color="#EC4899" sizeScale={0.8} />
    </group>
  );
};

// The Laser Beam connecting Satellite and Tracker
const LaserBeam = ({ start, end, scenario }) => {
  let color = "#00E5FF";
  let opacity = 0.8;
  
  if (scenario === 'UAV-2km') {
    color = "#10B981"; // Tactical Green for atmospheric
    opacity = 0.9;
  } else if (scenario === 'GEO-36K') {
    color = "#A855F7"; // High frequency UV/Purple for deep space
    opacity = 0.6;
  }

  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={scenario === 'UAV-2km' ? 6 : 4}
      transparent
      opacity={opacity}
    />
  );
};

const SatelliteView3D = ({ reticlePos3D, targetPos3D, scenario }) => {
  const satellitePos = [0, 8, -10];
  
  let beaconSize = 0.5;
  let beaconColor = "#FF2A2A";
  if (!scenario || scenario === 'ISRO-LEO-SIH') beaconColor = "#10B981"; // Emerald Green designated target
  if (scenario === 'GEO-36K') beaconSize = 0.15;
  if (scenario === 'LEO-500') beaconSize = 0.15;
  if (scenario === 'UAV-2km') beaconColor = "#F59E0B";

  const isLeo = scenario === 'LEO-500';
  const satScale = isLeo ? 0.3 : 1;

  let cameraPos = [10, 5, 10];
  if (!scenario || scenario === 'ISRO-LEO-SIH') {
    cameraPos = [0, 4, 15]; // Straight-on view for SIH scenario
  }

  return (
    <Canvas camera={{ position: cameraPos, fov: 45 }} dpr={[1, 1.5]}>
      {/* ENVIRONMENT LOGIC BASED ON SCENARIO */}

      {scenario === 'LEO-500' && (
        <>
          <color attach="background" args={['#0B0F19']} />
          <RotatingWorld scenario={scenario}>
            <Stars radius={100} depth={50} count={1000} factor={4} fade speed={2} />
          </RotatingWorld>
          <ambientLight intensity={0.2} />
          <directionalLight position={[-30, 20, -20]} intensity={3.5} color="#FFF5E6" castShadow />
        </>
      )}

      {scenario === 'GEO-36K' && (
        <>
          <color attach="background" args={['#020205']} />
          <Stars radius={200} depth={100} count={3000} factor={2} fade speed={0.2} />
          <ambientLight intensity={0.1} />
          <directionalLight position={[-50, 0, -50]} intensity={2.0} color="#E0E7FF" />
        </>
      )}

      {scenario === 'UAV-2km' && (
        <>
          <color attach="background" args={['#87CEEB']} />
          <fog attach="fog" args={['#87CEEB', 5, 45]} />
          <ambientLight intensity={0.8} />
          {/* Daylight Directional Light */}
          <directionalLight position={[20, 30, 20]} intensity={2.0} color="#ffffff" castShadow />
          
          {/* Coastal Ocean Water */}
          <mesh position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[300, 300]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.6} />
          </mesh>
        </>
      )}

      {(!scenario || scenario === 'ISRO-LEO-SIH') && (
        <>
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.2} />
          {/* Moon as primary light source */}
          <directionalLight position={[-40, 20, -60]} intensity={4.0} color="#e2e8f0" castShadow />
          
          <React.Suspense fallback={null}>
            <RealisticMoon />
          </React.Suspense>
          
          {/* Unlocked Distraction Beacons */}
          <MultiBeacons />
        </>
      )}
      
      {/* COMMON ELEMENTS */}
      
      {/* Shared Realistic Earth for all space scenarios */}
      {scenario !== 'UAV-2km' && (
        <RotatingWorld scenario={scenario}>
          <React.Suspense fallback={null}>
            <RealisticEarth scenario={scenario} />
          </React.Suspense>
        </RotatingWorld>
      )}
      
      {/* Satellite Platform */}
      <Satellite position={satellitePos} targetPos={reticlePos3D || [0, 0, 0]} scenario={scenario} scale={satScale} />
      
      {/* Target Beacon / Drone */}
      <group position={targetPos3D || [0, 0, 0]}>
        {scenario === 'UAV-2km' ? (
          <DroneModel color={beaconColor} />
        ) : (
          <HardwareBeacon color={beaconColor} sizeScale={beaconSize * 2.5} />
        )}
      </group>
      
      {/* Connecting Laser */}
      <LaserBeam 
        start={satellitePos} 
        end={reticlePos3D || [0, 0, 0]} 
        scenario={scenario}
      />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        makeDefault
      />
    </Canvas>
  );
};

export default SatelliteView3D;

