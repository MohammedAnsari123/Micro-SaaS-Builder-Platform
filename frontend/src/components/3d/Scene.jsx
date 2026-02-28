import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Panel from './Panel';

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
    const containerRef = useRef();
    const timeline = useRef();
    const cameraRef = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {

            // 1. Intro Animation (Plays automatically on page load)
            gsap.fromTo("#hero-text",
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1.2, delay: 0.5, ease: "power3.out" }
            );

            // 2. Create GSAP ScrollTrigger timeline
            timeline.current = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=4000",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Fade out the main text smoothly to focus on the 3D building process
            timeline.current.to("#hero-text", {
                opacity: 0,
                y: -50,
                duration: 0.2, // uses 20% of the scroll timeline
                ease: "power2.inOut"
            }, 0);

        }, containerRef.current);

        return () => ctx.revert(); // cleanup
    }, []);

    return (
        <div ref={containerRef} className="w-full h-screen relative bg-slate-950 overflow-hidden">

            {/* 3D Canvas */}
            <div className="absolute inset-0 z-10">
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera
                        makeDefault
                        ref={cameraRef}
                        position={[0, 0, 14]}
                        fov={50}
                    />

                    <ambientLight intensity={0.5} />
                    <directionalLight
                        position={[10, 10, 5]}
                        intensity={2}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />
                    <spotLight position={[-10, 10, 10]} intensity={1.5} angle={0.3} penumbra={1} />

                    {/* The animated Saas product block */}
                    <Panel timeline={timeline} />

                    {/* Environment provides reflections for the dark glass material */}
                    <Environment preset="city" />
                </Canvas>
            </div>

            {/* Stage 1: Absolute Hero UI Overlays (Fades out when scrolling starts) */}
            <div className="absolute inset-x-0 top-[15%] z-20 pointer-events-none px-6">
                <div className="max-w-7xl mx-auto text-center opacity-0" id="hero-text">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">
                        System Architect Mode
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 drop-shadow-2xl">
                        Build Your Micro SaaS <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400">
                            In Minutes
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto drop-shadow-lg mb-10">
                        From idea to deployed product — in one seamless workflow.
                    </p>
                    <button className="pointer-events-auto px-10 py-5 bg-white hover:bg-slate-200 text-slate-950 font-black rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all transform hover:scale-105 active:scale-95 text-xl tracking-wide">
                        Start Building Free
                    </button>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-slate-800 rounded-full z-30 overflow-hidden hidden md:block">
                <div className="w-full bg-blue-500" id="scroll-progress" style={{ height: '0%' }} />
            </div>

        </div>
    );
};

export default Scene;
