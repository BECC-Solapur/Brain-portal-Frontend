"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface ThreeImageCloudProps {
  cardCount?: number;
  className?: string;
  theme?: "dark" | "navy" | "transparent";
}

const TEXTURE_FILES = [
  "/assets/award-ceremony-1.jpg",
  "/assets/circle-discussion-1.png",
  "/assets/classroom-session-1.png",
  "/assets/classroom-session-2.png",
  "/assets/classroom-session-3.png",
  "/assets/classroom-session.jpeg",
  "/assets/group-photo-1.jpg",
  "/assets/group-visit.jpeg",
  "/assets/office-meeting-1.jpg",
  "/assets/outdoor-group-1.png",
  "/assets/school-event-1.jpg",
  "/assets/seminar-room-2.jpg",
  "/assets/session-room-1.png",
  "/assets/staff-training-1.jpg",
  "/assets/stage-event-1.png",
  "/assets/student-group-photo-1.jpg",
  "/assets/training-meeting.png",
];

const roundedVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const roundedFragmentShader = `
uniform sampler2D map;
uniform float radius;
uniform float opacity;
varying vec2 vUv;

float roundedBoxSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 p = vUv - 0.5;
  float d = roundedBoxSDF(p, vec2(0.5), radius);
  float aa = fwidth(d) * 1.5;
  float mask = 1.0 - smoothstep(-aa, aa, d);

  vec4 tex = texture2D(map, vUv);
  gl_FragColor = vec4(tex.rgb, tex.a * mask * opacity);
}
`;

function coverTextureTransform(texture: THREE.Texture, targetAspect: number) {
  const image = texture.image as HTMLImageElement | undefined;
  if (!image || !image.width || !image.height) return;
  const imageAspect = image.width / image.height;

  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

  if (imageAspect > targetAspect) {
    const repeatX = targetAspect / imageAspect;
    texture.repeat.set(repeatX, 1);
    texture.offset.set((1 - repeatX) / 2, 0);
  } else {
    const repeatY = imageAspect / targetAspect;
    texture.repeat.set(1, repeatY);
    texture.offset.set(0, (1 - repeatY) / 2);
  }
  texture.needsUpdate = true;
}

interface CardUserData {
  baseAngle: number;
  lane: number;
  radius: number;
  baseY: number;
  speed: number;
  phase: number;
  baseScale: number;
}

export default function ThreeImageCloud({
  cardCount = 36,
  className = "",
  theme = "navy",
}: ThreeImageCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let isDisposed = false;
    let animId: number;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 11.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    scene.add(group);

    // 2. Texture loading
    const loader = new THREE.TextureLoader();
    const loadedTextures: THREE.Texture[] = [];
    const cards: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];

    const texturePromises = TEXTURE_FILES.map(
      (src) =>
        new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            src,
            (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.anisotropy = Math.min(
                8,
                renderer.capabilities.getMaxAnisotropy()
              );
              loadedTextures.push(tex);
              resolve(tex);
            },
            undefined,
            (err) => {
              console.warn(`Failed to load texture ${src}:`, err);
              reject(err);
            }
          );
        })
    );

    // 3. Pointer management
    const pointer = new THREE.Vector2(0, 0);
    const targetPointer = new THREE.Vector2(0, 0);

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetPointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      targetPointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      targetPointer.set(0, 0);
    };

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);

    // 4. Responsive Resize
    const handleResize = () => {
      if (!stage || isDisposed) return;
      const rect = stage.getBoundingClientRect();
      const width = rect.width || 1;
      const height = rect.height || 1;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (width < 640) {
        camera.position.z = 13.8;
        group.scale.setScalar(0.92);
      } else {
        camera.position.z = 11.5;
        group.scale.setScalar(1);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(stage);
    handleResize();

    // 5. Build Cards & Start Loop
    const clock = new THREE.Clock();
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let sharedGeometry: THREE.PlaneGeometry | null = null;

    Promise.allSettled(texturePromises).then((results) => {
      if (isDisposed) return;

      const validTextures = results
        .filter(
          (r): r is PromiseFulfilledResult<THREE.Texture> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);

      if (validTextures.length === 0) {
        setLoadError(true);
        setLoading(false);
        return;
      }

      setLoading(false);

      sharedGeometry = new THREE.PlaneGeometry(2.35, 1.65, 1, 1);
      const aspect = 2.35 / 1.65;

      validTextures.forEach((t) => coverTextureTransform(t, aspect));

      for (let i = 0; i < cardCount; i++) {
        const texture = validTextures[i % validTextures.length];

        const material = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            radius: { value: 0.085 },
            opacity: { value: 1.0 },
          },
          vertexShader: roundedVertexShader,
          fragmentShader: roundedFragmentShader,
          transparent: true,
          depthTest: true,
          depthWrite: true,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(sharedGeometry, material);

        const angle = (i / cardCount) * Math.PI * 2;
        const lane = i % 3;
        const radius = 2.55 + lane * 0.36;
        const y = ((i % 4) - 1.5) * 0.86 + Math.sin(angle * 2.0) * 0.28;
        const z = Math.sin(angle) * 2.05 + (lane - 1) * 0.18;
        const x = Math.cos(angle) * radius;

        mesh.position.set(x, y, z);
        mesh.rotation.z = Math.sin(angle * 1.7) * 0.08;
        mesh.rotation.y = -angle * 0.13;

        const s = 0.74 + ((i * 19) % 7) * 0.035;
        mesh.scale.setScalar(s);

        const userData: CardUserData = {
          baseAngle: angle,
          lane,
          radius,
          baseY: y,
          speed: 0.13 + (i % 4) * 0.005,
          phase: i * 0.71,
          baseScale: s,
        };
        mesh.userData = userData;

        group.add(mesh);
        cards.push(mesh);
      }

      let elapsedSimTime = 0;
      let lastTime = clock.getElapsedTime();

      // Render Loop
      const animate = () => {
        if (isDisposed) return;

        const currentTime = clock.getElapsedTime();
        const delta = Math.min(currentTime - lastTime, 0.1);
        lastTime = currentTime;

        if (!reducedMotion) {
          elapsedSimTime += delta;
        }

        pointer.lerp(targetPointer, 0.055);

        camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.035;
        camera.position.y += (pointer.y * 0.45 - camera.position.y) * 0.035;
        camera.lookAt(0, 0, 0);

        group.rotation.y += (pointer.x * 0.075 - group.rotation.y) * 0.025;
        group.rotation.x += (-pointer.y * 0.045 - group.rotation.x) * 0.025;

        for (let i = 0; i < cards.length; i++) {
          const mesh = cards[i];
          const d = mesh.userData as CardUserData;
          const a = d.baseAngle + elapsedSimTime * d.speed;

          const orbitR = d.radius;
          mesh.position.x = Math.cos(a) * orbitR;
          mesh.position.z = Math.sin(a) * 2.2 + (d.lane - 1) * 0.2;
          mesh.position.y =
            d.baseY +
            Math.sin(elapsedSimTime * 0.72 + d.phase) * 0.22 +
            Math.cos(a * 2.0) * 0.12;

          const depthScale = THREE.MathUtils.mapLinear(
            mesh.position.z,
            -2.4,
            2.4,
            0.82,
            1.12
          );
          const pulse = 1 + Math.sin(elapsedSimTime * 0.65 + d.phase) * 0.015;
          mesh.scale.setScalar(d.baseScale * depthScale * pulse);

          mesh.rotation.z =
            Math.sin(a * 1.35 + d.phase) * 0.055 + pointer.x * 0.025;
          mesh.rotation.y = -Math.sin(a) * 0.22 + pointer.x * 0.08;

          const alpha = THREE.MathUtils.mapLinear(
            mesh.position.z,
            -2.4,
            2.4,
            0.72,
            1
          );
          mesh.material.uniforms.opacity.value = THREE.MathUtils.clamp(
            alpha,
            0.68,
            1
          );
        }

        // Draw farther cards first for clean transparent edges
        cards.sort((a, b) => a.position.z - b.position.z);
        for (let idx = 0; idx < cards.length; idx++) {
          cards[idx].renderOrder = idx;
        }

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      animate();
    });

    // 6. Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);

      cards.forEach((card) => {
        card.material.dispose();
      });
      if (sharedGeometry) {
        sharedGeometry.dispose();
      }
      loadedTextures.forEach((tex) => tex.dispose());
      renderer.dispose();
    };
  }, [cardCount]);

  const hasCustomHeight = /\bh-\[|\bh-full|\bh-screen\b/.test(className);
  const defaultHeight = hasCustomHeight
    ? ""
    : "h-[520px] sm:h-[620px] lg:h-[720px]";

  return (
    <div
      ref={stageRef}
      className={`relative w-full ${defaultHeight} overflow-hidden select-none touch-none ${className}`}
      aria-label="Interactive 3D Three.js Image Cloud"
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-[#f4c76a]" />
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center text-xs text-white/60">
          Could not load image assets.
        </div>
      )}
    </div>
  );
}
