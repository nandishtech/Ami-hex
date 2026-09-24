"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3DNetwork() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Group for entire network
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Nodes (Donors: Blue, Shelters: Green, Drivers: Orange)
    const nodeCount = 36;
    const nodes: THREE.Mesh[] = [];
    const nodeCoords: THREE.Vector3[] = [];

    const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);

    for (let i = 0; i < nodeCount; i++) {
      const isDonor = i % 3 === 0;
      const isRecipient = i % 3 === 1;

      const color = isDonor ? 0x1769ff : isRecipient ? 0x25c982 : 0xff9f43;
      const mat = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(sphereGeo, mat);

      // Random position in sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 7.5;

      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      mesh.position.copy(pos);
      nodes.push(mesh);
      nodeCoords.push(pos);
      networkGroup.add(mesh);
    }

    // Connect nodes with route lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1769ff,
      transparent: true,
      opacity: 0.28,
    });

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCoords.length; i++) {
      for (let j = i + 1; j < nodeCoords.length; j++) {
        if (nodeCoords[i].distanceTo(nodeCoords[j]) < 4.5) {
          linePoints.push(nodeCoords[i]);
          linePoints.push(nodeCoords[j]);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    networkGroup.add(lineMesh);

    // Glowing center core
    const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x071a2f,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    networkGroup.add(core);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      networkGroup.rotation.y += 0.002;
      networkGroup.rotation.x += 0.0008;

      // Subtle parallax response to mouse
      networkGroup.rotation.y += mouseX * 0.005;
      networkGroup.rotation.x += mouseY * 0.005;

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[380px] relative pointer-events-auto cursor-grab active:cursor-grabbing"
    />
  );
}
