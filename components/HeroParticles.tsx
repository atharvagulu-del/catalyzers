"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Container } from "tsparticles-engine";
import type { Engine } from "@tsparticles/engine";

export default function HeroParticles() {
    const particlesInit = useCallback(async (engine: Engine) => {
        // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine as any); // Using as any to bypass the strict type mismatch between the two libraries since they map identically under the hood.
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        // await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit as any}
            loaded={particlesLoaded as any}
            className="absolute inset-0 z-0 pointer-events-none"
            options={{
                fullScreen: { enable: false },
                particles: {
                    number: {
                        value: 40,
                        density: {
                            enable: true,
                            area: 800,
                        },
                    },
                    color: {
                        value: ["#ffffff", "#4f46e5", "#38bdf8", "#818cf8"],
                    },
                    shape: {
                        type: ["circle"],
                    },
                    opacity: {
                        value: 0.5,
                        random: true,
                        animation: {
                            enable: true,
                            speed: 1,
                            minimumValue: 0.1,
                            sync: false,
                        },
                    },
                    size: {
                        value: { min: 1, max: 3 },
                        random: true,
                        animation: {
                            enable: true,
                            speed: 2,
                            minimumValue: 0.5,
                            sync: false,
                        },
                    },
                    move: {
                        enable: true,
                        speed: 0.8,
                        direction: "bottom",
                        random: false,
                        straight: false,
                        outModes: {
                            default: "out",
                        },
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200,
                        },
                    },
                },
                interactivity: {
                    detectsOn: "canvas",
                    events: {
                        onHover: {
                            enable: true,
                            mode: "bubble",
                        },
                        resize: true,
                    },
                    modes: {
                        bubble: {
                            distance: 250,
                            size: 4,
                            duration: 2,
                            opacity: 1,
                        },
                    },
                },
                detectRetina: true,
            }}
        />
    );
}
