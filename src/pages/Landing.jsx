import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Float } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const FloatingPage = ({ position, title, path, color, imageUrl, size = 1 }) => {
  const navigate = useNavigate();
  
  const width = `${320 * size}px`;
  const height = `${220 * size}px`;
  const titleSize = `${24 * size}px`;

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
      <mesh position={position}>
        <Html transform distanceFactor={5} position={[0,0,0.1]} zIndexRange={[100, 0]}>
          <div 
            onClick={() => navigate(path)}
            onPointerEnter={(e) => {
              e.currentTarget.style.cursor = 'pointer'; // Restored pointer
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.boxShadow = `0 0 30px ${color}88`;
            }}
            onPointerLeave={(e) => {
              e.currentTarget.style.cursor = 'default'; // Restored default
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = `0 0 20px ${color}33`;
            }}
            style={{
              width: width, height: height, 
              background: `linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9)), url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'flex-end', alignItems: 'flex-start',
              color: '#fff', fontFamily: 'Orbitron',
              boxShadow: `0 0 20px ${color}33`,
              transition: 'all 0.3s ease',
              padding: '20px',
              boxSizing: 'border-box'
            }}>
            <h2 style={{ fontSize: titleSize, color: '#fff', margin: 0, padding: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: color, borderRadius: '50%', boxShadow: `0 0 10px ${color}` }}></div>
              <p style={{ fontSize: `${12 * size}px`, color: color, fontFamily: 'Inter', margin: 0, fontWeight: 600 }}>ENTER MODULE</p>
            </div>
          </div>
        </Html>
      </mesh>
    </Float>
  );
};

const Satellite = ({ cursorRef }) => {
  const satelliteRef = useRef();
  const [target] = useState(() => new THREE.Vector3(0, 0, 1.5));

  useFrame((state) => {
    if (!satelliteRef.current) return;

    const t = state.clock.getElapsedTime();

    // Fast cinematic entrance: 
    // Fly to center front, then dock to the side
    let targetPos;
    if (t < 1.5) {
      targetPos = new THREE.Vector3(0, 1, 4);
    } else {
      targetPos = new THREE.Vector3(6, 3, 2);
    }
    
    // Faster lerp for quicker movement
    satelliteRef.current.position.lerp(targetPos, 0.08);

    // Track the cursor with mathematical precision onto the Z=0 plane
    const vector = new THREE.Vector3(cursorRef.current.x, cursorRef.current.y, 0.5);
    vector.unproject(state.camera);
    const dir = vector.sub(state.camera.position).normalize();
    // Distance from camera to Z=0 plane (where the pages roughly are)
    const distance = -state.camera.position.z / dir.z; 
    const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));
    
    // Lerp target to exact cursor 3D position
    target.lerp(pos, 0.2); 
    
    // Object3D.lookAt points the LOCAL +Z axis towards the target
    satelliteRef.current.lookAt(target);
  });

  return (
    // Starts deep behind earth
    <group ref={satelliteRef} position={[0, -5, -20]}>
      {/* Central Body (aligned along Z) */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Solar Panel Left */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.4} emissive="#1e40af" emissiveIntensity={0.2} />
        <meshBasicMaterial color="#38bdf8" wireframe={true} />
      </mesh>

      {/* Solar Panel Right */}
      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.4} emissive="#1e40af" emissiveIntensity={0.2} />
        <meshBasicMaterial color="#38bdf8" wireframe={true} />
      </mesh>

      {/* Dish pointing forward (+Z). We rotate -PI/2 so the wide base faces +Z */}
      <mesh position={[0, 0, 0.6]} rotation={[-Math.PI/2, 0, 0]}>
        <coneGeometry args={[0.6, 0.4, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Antenna stick (+Z) */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
      </mesh>
      
      {/* Thicker Laser Beam Shooting Forward (+Z direction) */}
      {/* Center at +25 so it stretches from Z=0 to Z=50 */}
      <mesh position={[0, 0, 25]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 50]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

const Earth = () => {
  const earthRef = useRef();
  
  const [colorMap, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  useFrame(() => {
    if(earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={earthRef} position={[0, -6, -10]}>
      <sphereGeometry args={[8, 64, 64]} />
      <meshPhongMaterial 
        map={colorMap}
        normalMap={normalMap}
        specularMap={specularMap}
        specular={new THREE.Color('grey')}
        shininess={15}
      />
      <mesh>
        <sphereGeometry args={[8.2, 64, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} /> 
      </mesh>
    </mesh>
  );
}

const Landing = () => {
  const cursorRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    cursorRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    };
  };

  return (
    <div 
      onPointerMove={handlePointerMove}
      style={{ width: '100%', height: '100vh', background: 'var(--bg-deep)', position: 'relative', overflow: 'hidden' }}
    >
      
      {/* Background Canvas (Earth, Stars, Pages) */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <color attach="background" args={['#030712']} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 5, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#38bdf8" />
        
        <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
        
        <React.Suspense fallback={null}>
          <Earth />
        </React.Suspense>

        {/* Modules */}
        <FloatingPage position={[-5, 2, -2]} title="RESULTS THEATER" path="/environment" color="#38bdf8" imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600" size={0.7} />
        <FloatingPage position={[5, 2, -2]} title="LINK BUDGET" path="/linkbudget" color="#10b981" imageUrl="https://images.unsplash.com/photo-1582214400922-3a3f01c4cb45?q=80&w=600" size={0.7} />
        
        <FloatingPage position={[-5, -1, -2]} title="SCENARIO LAB" path="/scenarios" color="#38bdf8" imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600" size={0.7} />
        <FloatingPage position={[5, -1, -2]} title="DEPLOYMENT" path="/deploy" color="#f59e0b" imageUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600" size={0.7} />
        
        <FloatingPage position={[-5, -4, -2]} title="EVIDENCE BOARD" path="/evidence" color="#a855f7" imageUrl="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600" size={0.7} />
        <FloatingPage position={[5, -4, -2]} title="EVIDENCE LOG" path="/analytics" color="#94a3b8" imageUrl="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600" size={0.7} />
        
        <FloatingPage position={[0, 0, 1.5]} title="DOWNLOAD DESKTOP APP" path="/download" color="#10b981" imageUrl="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600" size={1.1} />
        
        <FloatingPage position={[0, -7, -2]} title="USER GUIDE" path="/user-guide" color="#10b981" imageUrl="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600" size={0.9} />

        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.2} maxDistance={15} minDistance={5} />
      </Canvas>

      {/* Foreground Canvas (Satellite overlaying EVERYTHING) */}
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 60 }} 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <Satellite cursorRef={cursorRef} />
      </Canvas>
      
      {/* Title Overlay */}
      <div style={{
        position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', pointerEvents: 'none', zIndex: 20
      }}>
        <h1 style={{ fontSize: '64px', color: '#fff', textShadow: '0 0 30px rgba(56, 189, 248, 0.8)', margin: 0, fontFamily: 'Orbitron', fontWeight: 'bold' }}>LaserPAT</h1>
        <p style={{ fontFamily: 'Inter', color: 'var(--accent-cyan)', letterSpacing: '6px', fontSize: '16px', marginTop: '12px', fontWeight: 600 }}>FSOC MISSION CONTROL</p>
      </div>
    </div>
  );
};

export default Landing;
