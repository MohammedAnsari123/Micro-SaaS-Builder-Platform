import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const SAAS_MODULES = [
    { id: 'auth', color: '#3b82f6', position: [-6, 4, -3], size: 1.2, geometry: 'icosahedron' },
    { id: 'database', color: '#8b5cf6', position: [7, -3, -5], size: 1.5, geometry: 'octahedron' },
    { id: 'payments', color: '#10b981', position: [-4, -6, -2], size: 1.0, geometry: 'dodecahedron' },
    { id: 'analytics', color: '#f59e0b', position: [5, 5, -6], size: 0.9, geometry: 'tetrahedron' },
    { id: 'storage', color: '#ef4444', position: [-8, 0, -4], size: 1.1, geometry: 'box' },
    { id: 'messaging', color: '#06b6d4', position: [3, -7, -3], size: 0.8, geometry: 'torus' },
    { id: 'cdn', color: '#ec4899', position: [9, 1, -7], size: 1.3, geometry: 'sphere' },
    { id: 'cache', color: '#84cc16', position: [-2, 8, -5], size: 0.7, geometry: 'icosahedron' },
];

const GeometryComponent = ({ type, size }) => {
    switch (type) {
        case 'icosahedron': return <icosahedronGeometry args={[size, 0]} />;
        case 'octahedron': return <octahedronGeometry args={[size, 0]} />;
        case 'dodecahedron': return <dodecahedronGeometry args={[size, 0]} />;
        case 'tetrahedron': return <tetrahedronGeometry args={[size, 0]} />;
        case 'box': return <boxGeometry args={[size, size, size]} />;
        case 'torus': return <torusGeometry args={[size * 0.7, size * 0.3, 16, 32]} />;
        case 'sphere': return <sphereGeometry args={[size, 16, 16]} />;
        default: return <icosahedronGeometry args={[size, 0]} />;
    }
};

const Module = ({ position, color, size, geometry, delay, scrollProgress }) => {
    const meshRef = useRef();
    const glowRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime + delay;
        const scroll = scrollProgress?.get?.() || 0;

        if (meshRef.current) {
            // Organic rotation
            meshRef.current.rotation.x = Math.cos(t / 3) * 0.4;
            meshRef.current.rotation.y = Math.sin(t / 2) * 0.5 + scroll * Math.PI;
            meshRef.current.rotation.z = Math.sin(t / 4) * 0.2;

            // Scroll-driven Z-depth push
            meshRef.current.position.z = position[2] + scroll * 12 - 3;

            // Breathing scale
            const breathe = 1 + Math.sin(t * 0.8) * 0.08;
            meshRef.current.scale.setScalar(breathe);
        }

        // Glow pulse
        if (glowRef.current) {
            glowRef.current.scale.setScalar(1 + Math.sin(t) * 0.15 + scroll * 0.3);
            glowRef.current.material.opacity = 0.08 + Math.sin(t * 0.5) * 0.04;
        }
    });

    return (
        <Float speed={1.5 + delay * 0.1} rotationIntensity={0.3} floatIntensity={0.6}>
            <group position={position}>
                {/* Main module mesh */}
                <mesh ref={meshRef}>
                    <GeometryComponent type={geometry} size={size} />
                    <MeshDistortMaterial
                        color={color}
                        speed={3}
                        distort={0.25}
                        radius={1}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </mesh>

                {/* Outer glow sphere */}
                <mesh ref={glowRef}>
                    <sphereGeometry args={[size * 2.5, 16, 16]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.06}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>
        </Float>
    );
};

const FloatingModules = ({ scrollProgress }) => {
    const groupRef = useRef();
    const { viewport } = useThree();
    const isMobile = viewport.width < 6;

    // Reduce module count on mobile
    const modules = useMemo(() => {
        const list = isMobile ? SAAS_MODULES.slice(0, 4) : SAAS_MODULES;
        return list.map((m) => ({
            ...m,
            delay: Math.random() * 10,
        }));
    }, [isMobile]);

    useFrame((state) => {
        if (groupRef.current) {
            const scroll = scrollProgress?.get?.() || 0;
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.015 + scroll * 0.5;
        }
    });

    return (
        <group ref={groupRef}>
            {modules.map((m) => (
                <Module
                    key={m.id}
                    position={m.position}
                    color={m.color}
                    size={m.size}
                    geometry={m.geometry}
                    delay={m.delay}
                    scrollProgress={scrollProgress}
                />
            ))}
        </group>
    );
};

export default FloatingModules;
