"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, Globe, Check, Flame, Box, ShieldCheck } from "lucide-react";

interface OpeningExperienceProps {
  onComplete?: () => void;
}

export default function OpeningHandoffExperience({ onComplete }: OpeningExperienceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"handoff" | "particles" | "network" | "ready">("handoff");
  const [subheading, setSubheading] = useState("Human connection turns surplus food into relief...");
  const [skipped, setSkipped] = useState(false);
  const [isHoveredBadge, setIsHoveredBadge] = useState(false);

  // Mouse coords for camera parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!mountRef.current || skipped) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040f1d, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0c2540, 1.8);
    scene.add(ambientLight);

    const handoffLight = new THREE.PointLight(0xffb703, 3, 22);
    handoffLight.position.set(0, 0.5, 2.5);
    scene.add(handoffLight);

    const greenRescueLight = new THREE.PointLight(0x25c982, 0, 30);
    greenRescueLight.position.set(0, 1.5, 3);
    scene.add(greenRescueLight);

    // 1. Donor Figure (Stylized cobalt metallic figure on left)
    const donorGroup = new THREE.Group();
    const donorHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x1769ff, metalness: 0.5, roughness: 0.3 })
    );
    donorHead.position.set(0, 1.5, 0);
    donorGroup.add(donorHead);

    const donorBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.75, 2.2, 24),
      new THREE.MeshStandardMaterial({ color: 0x1769ff, metalness: 0.4, roughness: 0.5, emissive: 0x051a3a })
    );
    donorBody.position.set(0, 0.2, 0);
    donorGroup.add(donorBody);
    donorGroup.position.set(-3.2, -0.4, 0);
    scene.add(donorGroup);

    // 2. Recipient Figure (Stylized emerald metallic figure on right)
    const recipientGroup = new THREE.Group();
    const recipientHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x25c982, metalness: 0.5, roughness: 0.3 })
    );
    recipientHead.position.set(0, 1.5, 0);
    recipientGroup.add(recipientHead);

    const recipientBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.75, 2.2, 24),
      new THREE.MeshStandardMaterial({ color: 0x25c982, metalness: 0.4, roughness: 0.5, emissive: 0x042416 })
    );
    recipientBody.position.set(0, 0.2, 0);
    recipientGroup.add(recipientBody);
    recipientGroup.position.set(3.2, -0.4, 0);
    scene.add(recipientGroup);

    // 3. Central Food Catering Container (Glowing Gold Thermobox)
    const foodBoxGroup = new THREE.Group();
    const foodBoxGeo = new THREE.BoxGeometry(1.4, 0.9, 1.1);
    const foodBoxMat = new THREE.MeshStandardMaterial({
      color: 0xf4b942,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0xff9f43,
      emissiveIntensity: 0.45,
    });
    const foodBox = new THREE.Mesh(foodBoxGeo, foodBoxMat);
    foodBoxGroup.add(foodBox);

    // Lid edge trim
    const lidTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.46, 0.12, 1.16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.2 })
    );
    lidTrim.position.set(0, 0.46, 0);
    foodBoxGroup.add(lidTrim);

    foodBoxGroup.position.set(0, 0.3, 0);
    scene.add(foodBoxGroup);

    // 4. Particle System (Surplus turning into rescue network)
    const particleCount = 550;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleTargetPositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorBlue = new THREE.Color(0x1769ff);
    const colorGreen = new THREE.Color(0x25c982);
    const colorGold = new THREE.Color(0xf4b942);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.6;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.4;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 4.5 + Math.random() * 6.5;

      particleTargetPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particleTargetPositions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particleTargetPositions[i * 3 + 2] = rad * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? colorBlue : i % 3 === 1 ? colorGreen : colorGold;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Network Route Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1769ff,
      transparent: true,
      opacity: 0,
    });
    const lineGeo = new THREE.BufferGeometry();
    const linePoints: number[] = [];
    for (let i = 0; i < 75; i++) {
      const idx1 = Math.floor(Math.random() * particleCount);
      const idx2 = Math.floor(Math.random() * particleCount);
      linePoints.push(
        particleTargetPositions[idx1 * 3],
        particleTargetPositions[idx1 * 3 + 1],
        particleTargetPositions[idx1 * 3 + 2],
        particleTargetPositions[idx2 * 3],
        particleTargetPositions[idx2 * 3 + 1],
        particleTargetPositions[idx2 * 3 + 2]
      );
    }
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePoints, 3));
    const networkLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(networkLines);

    // Parallax mouse move listener
    const onMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // Timing
    const startTime = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (Date.now() - startTime) / 1000;

      // Smooth camera parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      camera.position.x = mouseRef.current.x * 1.8;
      camera.position.y = 0.5 + mouseRef.current.y * 1.2;
      camera.lookAt(0, 0.2, 0);

      // Phase 1: 0 - 2.5s (Handoff)
      if (elapsed < 2.5) {
        foodBoxGroup.rotation.y = elapsed * 0.45;
        handoffLight.intensity = 2.0 + Math.sin(elapsed * 6) * 0.8;
        donorGroup.position.x = -3.2 + Math.min(1.2, elapsed * 0.5);
        recipientGroup.position.x = 3.2 - Math.min(1.2, elapsed * 0.5);
      }
      // Phase 2: 2.5s - 5.2s (Particle burst)
      else if (elapsed < 5.2) {
        if (phase !== "particles") {
          setPhase("particles");
          setSubheading("Surplus food dissolves into real-time logistical particles...");
        }
        handoffLight.intensity = Math.max(0, 4 - (elapsed - 2.5) * 1.5);
        greenRescueLight.intensity = Math.min(4.5, (elapsed - 2.5) * 2);

        const pPositions = particleGeo.attributes.position.array as Float32Array;
        const progress = Math.min(1, (elapsed - 2.5) / 2.7);
        for (let i = 0; i < particleCount; i++) {
          pPositions[i * 3] += (particleTargetPositions[i * 3] - pPositions[i * 3]) * 0.05;
          pPositions[i * 3 + 1] += (particleTargetPositions[i * 3 + 1] - pPositions[i * 3 + 1]) * 0.05;
          pPositions[i * 3 + 2] += (particleTargetPositions[i * 3 + 2] - pPositions[i * 3 + 2]) * 0.05;
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleMat.opacity = Math.min(0.95, 0.2 + progress * 0.75);

        // Dissolve meshes
        donorGroup.scale.setScalar(Math.max(0.01, 1 - (elapsed - 2.5) * 0.4));
        recipientGroup.scale.setScalar(Math.max(0.01, 1 - (elapsed - 2.5) * 0.4));
        foodBoxGroup.scale.setScalar(Math.max(0.01, 1 - (elapsed - 2.5) * 0.4));
      }
      // Phase 3: 5.2s+ (Network web)
      else {
        if (phase !== "network" && phase !== "ready") {
          setPhase("network");
          setSubheading("A Living Rescue Network forms across the city.");
          setTimeout(() => setPhase("ready"), 1200);
        }
        particles.rotation.y += 0.0025;
        particles.rotation.x += 0.001;
        networkLines.rotation.y += 0.0025;
        networkLines.rotation.x += 0.001;
        lineMat.opacity = Math.min(0.5, (elapsed - 5.2) * 0.25);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [skipped]);

  const handleSkip = () => {
    setSkipped(true);
    setPhase("ready");
    if (onComplete) onComplete();
  };

  return (
    <div className="relative w-full h-[90vh] min-h-[640px] bg-gradient-to-b from-resq-navy-dark via-resq-navy to-[#071d33] overflow-hidden flex items-center justify-center select-none">
      {/* 3D WebGL Canvas */}
      {!skipped && <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab" />}

      {/* Interactive Food Container Hover Badge */}
      {phase === "handoff" && !skipped && (
        <div
          onMouseEnter={() => setIsHoveredBadge(true)}
          onMouseLeave={() => setIsHoveredBadge(false)}
          className="absolute z-20 top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer animate-float"
        >
          <div className="px-4 py-2 rounded-2xl bg-resq-navy/90 backdrop-blur-md border border-resq-gold/60 text-white shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105 hover:border-resq-gold hover:shadow-glow">
            <span className="p-1 rounded-lg bg-resq-gold/20 text-resq-gold">
              <Box className="w-4 h-4" />
            </span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-resq-gold">30 KG ≈ 120 MEALS</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  HOT HOLD 68°C
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                Paneer Butter Masala, Jeera Rice & Garlic Naan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skip Intro */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-3">
        <button
          onClick={handleSkip}
          className="text-xs font-medium text-slate-400 hover:text-white px-3.5 py-1.5 rounded-full border border-slate-700 bg-resq-navy/60 backdrop-blur transition-all"
        >
          Skip Intro
        </button>
      </div>

      {/* Overlay Narrative Text & Call to Actions */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white pointer-events-auto flex flex-col items-center">
        {/* Phase Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-resq-green-bright mb-4 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-resq-green-bright" />
          {phase === "handoff" && "Act I: Dignified Human Handoff"}
          {phase === "particles" && "Act II: Surplus Becomes Network"}
          {(phase === "network" || phase === "ready") && "Act III: The RESQFOOD Engine"}
        </div>

        {/* Cinematic Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-3">
          Rescue Food.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-resq-blue via-resq-gold to-resq-green-bright">
            Route Hope.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl mb-8 min-h-[56px] transition-all duration-300">
          {subheading}
        </p>

        {/* Primary Gateway Action */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <a
            href="#gateway"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-resq-blue text-white font-black text-base shadow-glow hover:bg-resq-blue-hover active:scale-95 transition-all"
          >
            <Sparkles className="w-5 h-5 text-resq-gold" />
            Enter Registration & Login Gateway
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Live operational ticker */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-resq-green-bright animate-ping" />
            <span className="text-white font-bold">18 Verified Orgs</span> Active Now
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">12 EV Drivers</span> in Bengaluru
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">14 min</span> Average Rescue Dispatch
          </div>
        </div>
      </div>
    </div>
  );
}
