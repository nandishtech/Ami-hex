"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, Globe, Check } from "lucide-react";

interface OpeningExperienceProps {
  onComplete?: () => void;
}

export default function OpeningHandoffExperience({ onComplete }: OpeningExperienceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"handoff" | "particles" | "network" | "ready">("handoff");
  const [subheading, setSubheading] = useState("Human connection turns surplus food into relief...");
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (!mountRef.current || skipped) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040f1d, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x0c2540, 1.5);
    scene.add(ambientLight);

    const handoffLight = new THREE.PointLight(0xff9f43, 2, 20);
    handoffLight.position.set(0, 0, 2);
    scene.add(handoffLight);

    const greenRescueLight = new THREE.PointLight(0x25c982, 0, 30);
    greenRescueLight.position.set(0, 1, 3);
    scene.add(greenRescueLight);

    // 1. Donor Figure Representation (Stylized mesh on left)
    const donorGeo = new THREE.CylinderGeometry(0.5, 0.7, 2.4, 16);
    const donorMat = new THREE.MeshStandardMaterial({
      color: 0x1769ff,
      metalness: 0.3,
      roughness: 0.6,
      emissive: 0x071a2f,
    });
    const donorMesh = new THREE.Mesh(donorGeo, donorMat);
    donorMesh.position.set(-3.2, -0.4, 0);
    scene.add(donorMesh);

    // 2. Recipient Figure Representation (Stylized mesh on right)
    const recipientGeo = new THREE.CylinderGeometry(0.5, 0.7, 2.4, 16);
    const recipientMat = new THREE.MeshStandardMaterial({
      color: 0x18a66a,
      metalness: 0.3,
      roughness: 0.6,
      emissive: 0x071a2f,
    });
    const recipientMesh = new THREE.Mesh(recipientGeo, recipientMat);
    recipientMesh.position.set(3.2, -0.4, 0);
    scene.add(recipientMesh);

    // 3. Central Food Catering Container
    const foodBoxGeo = new THREE.BoxGeometry(1.2, 0.8, 1.0);
    const foodBoxMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xff9f43,
      emissiveIntensity: 0.4,
    });
    const foodBox = new THREE.Mesh(foodBoxGeo, foodBoxMat);
    foodBox.position.set(0, 0.2, 0);
    scene.add(foodBox);

    // 4. Particle System (Surplus turning into rescue network)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleTargetPositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorBlue = new THREE.Color(0x1769ff);
    const colorGreen = new THREE.Color(0x25c982);
    const colorWarm = new THREE.Color(0xff9f43);

    for (let i = 0; i < particleCount; i++) {
      // Start inside/around the food container
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      // Targets: expand into rescue network nodes in 3D sphere/web
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 4 + Math.random() * 6;

      particleTargetPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particleTargetPositions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particleTargetPositions[i * 3 + 2] = rad * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? colorBlue : i % 3 === 1 ? colorGreen : colorWarm;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Network Route Lines (Appear in Network phase)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1769ff,
      transparent: true,
      opacity: 0,
    });
    const lineGeo = new THREE.BufferGeometry();
    const linePoints: number[] = [];
    for (let i = 0; i < 60; i++) {
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

    // Timing and Progression
    let startTime = Date.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (Date.now() - startTime) / 1000;

      // Phase 1: 0 - 2.5s (Handoff)
      if (elapsed < 2.5) {
        foodBox.rotation.y = elapsed * 0.5;
        handoffLight.intensity = 1.5 + Math.sin(elapsed * 5) * 0.6;
        donorMesh.position.x = -3.2 + Math.min(1.2, elapsed * 0.5);
        recipientMesh.position.x = 3.2 - Math.min(1.2, elapsed * 0.5);
      }
      // Phase 2: 2.5s - 5s (Handoff contact -> particles burst)
      else if (elapsed < 5.2) {
        if (phase !== "particles") {
          setPhase("particles");
          setSubheading("Surplus food dissolves into real-time logistical particles...");
        }
        handoffLight.intensity = Math.max(0, 4 - (elapsed - 2.5) * 1.5);
        greenRescueLight.intensity = Math.min(4, (elapsed - 2.5) * 2);

        // Morph particles towards target positions
        const pPositions = particleGeo.attributes.position.array as Float32Array;
        const progress = Math.min(1, (elapsed - 2.5) / 2.5);
        for (let i = 0; i < particleCount; i++) {
          pPositions[i * 3] += (particleTargetPositions[i * 3] - pPositions[i * 3]) * 0.05;
          pPositions[i * 3 + 1] += (particleTargetPositions[i * 3 + 1] - pPositions[i * 3 + 1]) * 0.05;
          pPositions[i * 3 + 2] += (particleTargetPositions[i * 3 + 2] - pPositions[i * 3 + 2]) * 0.05;
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleMat.opacity = Math.min(0.9, 0.2 + progress * 0.7);

        // Dissolve meshes
        donorMesh.scale.setScalar(Math.max(0.01, 1 - (elapsed - 2.5) * 0.4));
        recipientMesh.scale.setScalar(Math.max(0.01, 1 - (elapsed - 2.5) * 0.4));
        foodBox.scale.setScalar(Math.max(0.01, 1 - (elapsed - 2.5) * 0.4));
      }
      // Phase 3: 5.2s+ (Network forms)
      else {
        if (phase !== "network" && phase !== "ready") {
          setPhase("network");
          setSubheading("A Living Rescue Network forms across the city.");
          setTimeout(() => setPhase("ready"), 1200);
        }
        particles.rotation.y += 0.003;
        particles.rotation.x += 0.001;
        networkLines.rotation.y += 0.003;
        networkLines.rotation.x += 0.001;
        lineMat.opacity = Math.min(0.45, (elapsed - 5.2) * 0.2);
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
    <div className="relative w-full h-[88vh] min-h-[580px] bg-gradient-to-b from-resq-navy-dark via-resq-navy to-[#0c2540] overflow-hidden flex items-center justify-center">
      {/* 3D WebGL Canvas */}
      {!skipped && <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />}

      {/* Skip / Reduced Motion Controls */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-3">
        <button
          onClick={handleSkip}
          className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 bg-resq-navy/60 backdrop-blur transition-colors"
        >
          Skip Intro
        </button>
      </div>

      {/* Overlay Narrative Text & Call to Actions */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white pointer-events-auto flex flex-col items-center">
        {/* Phase Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-resq-green-bright mb-4 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-resq-green-bright" />
          {phase === "handoff" && "Act I: The Human Handoff"}
          {phase === "particles" && "Act II: Surplus Becomes Network"}
          {(phase === "network" || phase === "ready") && "Act III: The RESQFOOD Engine"}
        </div>

        {/* Cinematic Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-3">
          Rescue Food.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-resq-blue to-resq-green-bright">
            Route Hope.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl mb-8 min-h-[56px] transition-all duration-300">
          {subheading}
        </p>

        {/* Buttons appearing in Ready phase */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link
            href="/donor?action=create"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-resq-blue text-white font-bold text-sm shadow-glow hover:bg-resq-blue-hover active:scale-95 transition-all"
          >
            Start a Rescue
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/network"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur border border-white/20 transition-all"
          >
            <Globe className="w-4 h-4 text-resq-green-bright" />
            Explore Network
          </Link>

          <Link
            href="/demo"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-resq-green to-resq-green-bright text-white font-bold text-sm shadow-glow-green hover:opacity-95 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            Interactive Demo
          </Link>
        </div>

        {/* Live operational ticker */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-resq-green-bright animate-ping" />
            <span className="text-white font-bold">18 Verified Orgs</span> Active Now
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">12 Drivers</span> in Bengaluru
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">18 min</span> Average Rescue Dispatch
          </div>
        </div>
      </div>
    </div>
  );
}
