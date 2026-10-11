import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Real-time 3D NotePin: a brushed graphite capsule that follows the pointer. */
export default function PinModel() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    cam.position.set(0, 0, 9);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = new THREE.Scene();
    const glow = (c: number, x: number, y: number, z: number, s: number) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 16), new THREE.MeshBasicMaterial({ color: c }));
      m.position.set(x, y, z);
      env.add(m);
    };
    glow(0xff9a4d, 6, 4, 4, 2.4);
    glow(0x9b6bff, -6, -2, 3, 2.6);
    glow(0xffffff, 0, 6, -4, 1.8);
    scene.environment = pmrem.fromScene(env, 0.04).texture;

    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.9, 1.9, 24, 64),
      new THREE.MeshPhysicalMaterial({ color: 0x8a8c92, metalness: 0.7, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
    );
    body.scale.z = 0.42;
    group.add(body);
    const clip = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.62, 1.4, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0x1b1c20, metalness: 0.6, roughness: 0.5 }),
    );
    clip.scale.z = 0.12;
    clip.position.set(0.18, 0.15, -0.5);
    group.add(clip);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    led.position.set(0, 1.2, 0.39);
    group.add(led);
    group.rotation.set(0.15, -0.5, -0.18);
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffd2a0, 2.2); key.position.set(4, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xa880ff, 2.4); rim.position.set(-5, -1, -2); scene.add(rim);

    const size = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    size();
    window.addEventListener("resize", size);
    const m = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      m.x = e.clientX / innerWidth - 0.5;
      m.y = e.clientY / innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move);
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      group.rotation.y += (-0.5 + Math.sin(t * 0.4) * 0.6 + m.x * 1.2 - group.rotation.y) * 0.05;
      group.rotation.x += (0.15 + m.y * 0.6 - group.rotation.x) * 0.05;
      group.position.y = Math.sin(t * 1.1) * 0.12;
      (led.material as THREE.MeshBasicMaterial).color.setScalar(0.6 + Math.sin(t * 3) * 0.4);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", move);
      renderer.dispose();
      pmrem.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} className="np-3d" aria-label="3D model of the PLAUD NotePin" role="img" />;
}
