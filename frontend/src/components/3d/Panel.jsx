import React, { useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { TOOLS } from '../../constants/tools';
import gsap from 'gsap';

const Panel = ({ timeline }) => {
    const groupRef = useRef();
    const meshRef = useRef();
    const toolsRef = useRef([]);
    const glowRef = useRef();
    const uiRef = useRef();

    useLayoutEffect(() => {
        if (!timeline.current || !groupRef.current) return;
        const tl = timeline.current;

        // Stage 1: Initial Starting Position (below the text)
        gsap.set(groupRef.current.position, { y: -2, z: 0 });
        gsap.set(groupRef.current.rotation, { x: 0, y: 0, z: 0 });

        // Intro Animation on load (flies in from bottom)
        gsap.from(groupRef.current.position, { y: -12, duration: 1.5, ease: "power3.out" });
        gsap.from(groupRef.current.rotation, { x: 0.5, y: -0.5, duration: 1.5, ease: "power3.out" });

        // Stage 2: Flatten Transition (20-40%)
        tl.to(groupRef.current.rotation, {
            x: -1.2, // tilt backward like a desk at an angle instead of fully flat, keeping it easily visible to fixed camera
            ease: "power2.inOut",
        }, 0);

        tl.to(groupRef.current.position, {
            y: -3, // slide down slightly
            z: -4, // push back to make room for glowing UI popup
            ease: "power2.inOut"
        }, 0);

        // Stage 3: Tool Integration (40-65%)
        // Tools snap in with staggered bounce
        toolsRef.current.forEach((tool, i) => {
            if (tool) {
                gsap.set(tool.position, { z: 5 }); // start high up
                gsap.set(tool.scale, { x: 0, y: 0, z: 0 }); // start small

                tl.to(tool.position, {
                    z: 0.1, // drop down to surface
                    ease: "bounce.out"
                }, 0.3 + (i * 0.05));

                tl.to(tool.scale, {
                    x: 1, y: 1, z: 1,
                    ease: "back.out(1.7)"
                }, 0.3 + (i * 0.05));
            }
        });

        // Stage 4: Assembly & Glow (65-82%)
        if (glowRef.current) {
            tl.to(glowRef.current.material, {
                opacity: 0.8,
                duration: 0.2,
                ease: "power2.inOut"
            }, 0.6);
        }

        if (uiRef.current) {
            tl.to(uiRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.2,
                ease: "power2.out"
            }, 0.65);
        }

        // Stage 5: Launch (82-100%)
        tl.to(groupRef.current.rotation, {
            x: 0, // Stand back up
            ease: "power3.inOut"
        }, 0.8);

        tl.to(groupRef.current.position, {
            y: -1, // Almost Center screen
            z: 0,
            ease: "power3.inOut"
        }, 0.8);

        // Hide glow and tools UI as it launches
        if (glowRef.current) tl.to(glowRef.current.material, { opacity: 0, duration: 0.1 }, 0.8);
        if (uiRef.current) tl.to(uiRef.current, { opacity: 0, duration: 0.1 }, 0.8);

    }, [timeline]);

    // Stage 1 IDLE animation when not scrolling
    useFrame((state) => {
        if (!timeline.current || timeline.current.progress() === 0) {
            // Slight float
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* The Main SaaS Panel */}
            <mesh ref={meshRef} castShadow receiveShadow>
                <boxGeometry args={[6, 9, 0.2]} />
                <meshStandardMaterial
                    color="#0f172a"
                    roughness={0.2}
                    metalness={0.8}
                    envMapIntensity={1}
                />
            </mesh>

            {/* Glowing borders during assembly */}
            <mesh ref={glowRef} position={[0, 0, -0.05]}>
                <boxGeometry args={[6.2, 9.2, 0.1]} />
                <meshBasicMaterial color="#4f46e5" transparent opacity={0} />
            </mesh>

            {/* The Tools */}
            <group position={[0, 0, 0.1]}>
                {TOOLS.map((tool, index) => (
                    <group
                        key={tool.id}
                        position={tool.position}
                        ref={(el) => (toolsRef.current[index] = el)}
                    >
                        {/* We use Drei's Html to render sharp Lucide icons and text, perfectly mapped to 3D space */}
                        <Html transform distanceFactor={5} zIndexRange={[100, 0]} className="pointer-events-none">
                            <div className="flex flex-col items-center justify-center bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-2xl p-4 w-40 h-40 shadow-2xl transition-all">
                                <tool.icon className="w-12 h-12 mb-3 drop-shadow-lg" style={{ color: tool.color }} />
                                <h3 className="text-white font-bold text-lg">{tool.label}</h3>
                                <p className="text-slate-400 text-xs font-medium text-center">{tool.feature}</p>
                            </div>
                        </Html>
                    </group>
                ))}

                {/* The Assembled Dashboard UI that appears in Stage 4 */}
                <Html
                    ref={uiRef}
                    transform
                    distanceFactor={5}
                    position={[0, 0, 0.1]}
                    style={{ opacity: 0, transform: 'translateY(20px)' }}
                    className="pointer-events-none"
                >
                    <div className="w-[800px] h-[1100px] bg-slate-950/90 border border-blue-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)] backdrop-blur-xl flex flex-col">
                        <div className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-900/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            </div>
                            <div className="mx-auto text-blue-400 font-bold uppercase tracking-widest text-sm">System Generated Dashboard</div>
                        </div>
                        <div className="p-8 flex gap-8 h-full">
                            <div className="w-64 border-r border-slate-800 space-y-4">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-800/50 rounded-xl w-full" />)}
                            </div>
                            <div className="flex-1 space-y-8">
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-2xl w-full" />)}
                                </div>
                                <div className="h-96 bg-slate-800/30 rounded-3xl border border-slate-800/50 w-full" />
                            </div>
                        </div>
                    </div>
                </Html>
            </group>
        </group>
    );
};

export default Panel;
