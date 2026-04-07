import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80;

    // ── Particle geometry ──────────────────────────────────────────────
    const COUNT = 4500;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);

    // Red/crimson palette matching the logo
    const colRed     = new THREE.Color('#e01c2e').multiplyScalar(1.8);
    const colCrimson = new THREE.Color('#cc0f1f').multiplyScalar(1.5);
    const colYellow  = new THREE.Color('#f5ff4b').multiplyScalar(1.4);
    const colWhite   = new THREE.Color('#ffffff').multiplyScalar(0.85);
    const colOrange  = new THREE.Color('#ff4422').multiplyScalar(1.3);
    const palette    = [colRed, colRed, colCrimson, colOrange, colYellow, colWhite];

    for (let i = 0; i < COUNT; i++) {
      // Concentrated in a wide but shallow field — more particles near camera plane
      positions[i * 3]     = (Math.random() - 0.5) * 280;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;  // shallower Z → more visible

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Bigger sizes so they're clearly visible; largest ones = bright accent dots
      sizes[i] = Math.random() < 0.15
        ? Math.random() * 4.0 + 3.0   // 15% large glow dots
        : Math.random() * 2.5 + 1.2;  // regular particles
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

    // ── Shader material with mouse ripple ──────────────────────────────
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime:  { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        uniform vec2  uMouse;

        void main() {
          vColor = color;
          vec3 pos = position;

          // gentle wave drift
          pos.y += sin(pos.x * 0.04 + uTime * 0.5) * 2.0;
          pos.x += cos(pos.z * 0.03 + uTime * 0.4) * 1.5;

          // mouse repulsion ripple
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vec2 screenPos  = mvPosition.xy / abs(mvPosition.z);
          float dist = length(screenPos - uMouse * 0.9);
          float ripple = exp(-dist * dist * 0.4) * 6.0;
          pos.z += ripple * sin(uTime * 3.0 + dist * 4.0);

          gl_Position   = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize  = size * (220.0 / -mvPosition.z);  // larger scale factor
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          // Soft glow edge — bright center, feathered fade
          float core  = 1.0 - smoothstep(0.0, 0.22, d);
          float halo  = 1.0 - smoothstep(0.15, 0.5, d);
          float alpha = core * 0.95 + halo * 0.45;
          gl_FragColor = vec4(vColor * (1.0 + core * 0.6), alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
    });

    const particles = new THREE.Points(geo, material);
    scene.add(particles);

    // ── Mouse tracking ─────────────────────────────────────────────────
    const mouse = new THREE.Vector2(0, 0);
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Resize ─────────────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Visibility — pause when tab hidden ─────────────────────────────
    let paused = false;
    const handleVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', handleVisibility);

    // ── Animation loop ─────────────────────────────────────────────────
    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (paused) return;

      const t = clock.getElapsedTime();
      material.uniforms.uTime.value  = t;
      material.uniforms.uMouse.value.lerp(mouse, 0.06);

      particles.rotation.y = t * 0.018;
      particles.rotation.x = t * 0.008;

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      geo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-canvas" />;
}
