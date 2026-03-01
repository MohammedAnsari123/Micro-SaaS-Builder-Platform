import React, { useRef, useLayoutEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Panel from './Panel';
import ImmersiveBackground from './ImmersiveBackground';

gsap.registerPlugin(ScrollTrigger);

/* ─── Camera Controller ─── */
const CameraRig = ({ timeline }) => {
    const { camera } = useThree();

    useLayoutEffect(() => {
        if (!timeline.current) return;
        const tl = timeline.current;

        // Stage 1: Starting camera position (front view)
        gsap.set(camera.position, { x: 0, y: 0, z: 12 });
        gsap.set(camera.rotation, { x: 0, y: 0, z: 0 });

        // Stage 2: Camera glides down and forward (looking at flat panel from above)
        tl.to(camera.position, {
            x: 0,
            y: 6,  // move up
            z: 10,  // come slightly closer
            ease: 'power2.inOut',
        }, 0);

        tl.to(camera.rotation, {
            x: -0.5, // look down
            ease: 'power2.inOut',
        }, 0);

        // Stage 3-4: Camera stays looking at the workspace
        // (no camera change, panel does the work)

        // Stage 5: Camera pulls back to front view
        tl.to(camera.position, {
            x: 0,
            y: 0,
            z: 12,
            ease: 'power3.inOut',
        }, 0.82);

        tl.to(camera.rotation, {
            x: 0,
            ease: 'power3.inOut',
        }, 0.82);

    }, [timeline, camera]);

    return null;
};

/* ─── Scroll Progress Indicator ─── */
const ScrollProgress = ({ progress }) => (
    <div className="fixed right-0 top-0 w-1 h-screen z-50 pointer-events-none">
        <div
            className="w-full bg-gradient-to-b from-blue-500 to-cyan-400 origin-top transition-transform"
            style={{ height: '100%', transform: `scaleY(${progress})` }}
        />
    </div>
);

/* ─── Stage Labels ─── */
const StageLabel = ({ text, visible }) => (
    <div
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
        <div className="px-6 py-2.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full text-blue-400 font-mono text-xs uppercase tracking-[0.4em] font-bold shadow-xl">
            {text}
        </div>
    </div>
);

/* ═══════════════════════════════════════
   MAIN SCENE COMPONENT
   ═══════════════════════════════════════ */
const Scene = () => {
    const containerRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const timelineRef = useRef(null);
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const [stageLabel, setStageLabel] = React.useState('');
    const [stageLabelVisible, setStageLabelVisible] = React.useState(false);

    useLayoutEffect(() => {
        // Create a master GSAP timeline
        const tl = gsap.timeline({ paused: true });
        timelineRef.current = tl;

        // ScrollTrigger pins the canvas and scrubs the timeline
        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: '+=400%',  // 4x viewport height of scroll
            pin: canvasContainerRef.current,
            scrub: 1.5,
            onUpdate: (self) => {
                const p = self.progress;
                tl.progress(p);
                setScrollProgress(p);

                // Stage labels
                if (p < 0.18) {
                    setStageLabelVisible(false);
                } else if (p < 0.42) {
                    setStageLabel('BUILDING YOUR STACK');
                    setStageLabelVisible(true);
                } else if (p < 0.65) {
                    setStageLabel('INTEGRATING MODULES');
                    setStageLabelVisible(true);
                } else if (p < 0.82) {
                    setStageLabel('YOUR PRODUCT IS TAKING SHAPE');
                    setStageLabelVisible(true);
                } else {
                    setStageLabel('LAUNCH SEQUENCE INITIATED');
                    setStageLabelVisible(p < 0.95);
                }
            }
        });

        return () => {
            trigger.kill();
            tl.kill();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
            <div ref={canvasContainerRef} className="relative w-full h-screen">
                {/* 3D Canvas */}
                <Canvas
                    shadows
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    className="!fixed inset-0"
                >
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={60} />
                        <CameraRig timeline={timelineRef} />
                        <Panel timeline={timelineRef} />
                        <ImmersiveBackground />
                        <Environment preset="city" />
                    </Suspense>

                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[5, 8, 5]}
                        intensity={0.8}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <pointLight position={[-5, -5, 5]} intensity={0.3} color="#4CC9F0" />
                </Canvas>

                {/* Hero Overlay (visible at Stage 1) */}
                <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 transition-all duration-700 ${scrollProgress > 0.08 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Build Your Micro SaaS<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                            in Minutes
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-slate-400 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                        From idea to deployed product — in one workflow
                    </p>
                    <a
                        href="/register"
                        className="px-8 sm:px-10 py-4 sm:py-5 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl transition-all active:scale-95 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] text-sm sm:text-base uppercase tracking-widest"
                    >
                        Start Building Free
                    </a>
                </div>

                {/* Stage Labels */}
                <StageLabel text={stageLabel} visible={stageLabelVisible} />

                {/* Scroll Progress Bar */}
                <ScrollProgress progress={scrollProgress} />
            </div>
        </div>
    );
};

export default Scene;
