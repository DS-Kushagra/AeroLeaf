import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthTexture from "../assets/earth-texture.jpg";
import carbonMap from "../assets/carbon-map.jpg";

const HeroSection = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create Earth globe
    const textureLoader = new THREE.TextureLoader();
    const globeGeometry = new THREE.SphereGeometry(5, 64, 64);

    // Use imported textures (or fallback to solid materials if imports fail)
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load(earthTexture),
      bumpMap: textureLoader.load(carbonMap),
      bumpScale: 0.05,
      shininess: 5,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(5.15, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x93f542,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(15, 15, 15);
    scene.add(pointLight);

    // Add floating carbon credit tokens
    for (let i = 0; i < 15; i++) {
      const tokenGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
      const tokenMaterial = new THREE.MeshPhongMaterial({
        color: 0x3eda84,
        shininess: 100,
        emissive: 0x2b8a5c,
        emissiveIntensity: 0.3,
      });

      const token = new THREE.Mesh(tokenGeometry, tokenMaterial);

      // Position randomly around globe
      const radius = 7 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      token.position.x = radius * Math.sin(phi) * Math.cos(theta);
      token.position.y = radius * Math.sin(phi) * Math.sin(theta);
      token.position.z = radius * Math.cos(phi);

      // Store initial positions for animation
      token.userData.orbit = {
        radius,
        speed: 0.001 + Math.random() * 0.003,
        startAngle: Math.random() * Math.PI * 2,
        height: Math.random() * 6 - 3,
      };

      scene.add(token);
    }

    // Set up controls and camera position
    camera.position.z = 15;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate globe slowly
      globe.rotation.y += 0.001;

      // Animate tokens
      scene.children.forEach((child) => {
        if (child.userData.orbit) {
          const orbit = child.userData.orbit;
          const angle =
            orbit.startAngle + performance.now() * orbit.speed * 0.001;

          child.position.x = orbit.radius * Math.cos(angle);
          child.position.z = orbit.radius * Math.sin(angle);
          child.position.y =
            orbit.height + Math.sin(performance.now() * 0.001) * 0.5;

          child.rotation.y += 0.02;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 text-white">
      {/* 3D Globe Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 opacity-90"
        style={{ height: "100%" }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 py-24 min-h-[85vh] flex flex-col items-center justify-center">
        <div className="max-w-3xl text-center backdrop-blur-sm bg-black/10 p-8 rounded-xl border border-white/10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-400">
              AeroLeaf
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8">
            Transforming Carbon Credits with Blockchain & Satellite Verification
          </p>
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Our platform uses satellite imagery and AI to transparently verify
            reforestation projects, ensuring your carbon offsets have real
            environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-green-900 font-semibold rounded-full transition-all text-lg transform hover:scale-105"
            >
              Explore Dashboard
            </Link>
            <Link
              to="/marketplace"
              className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold rounded-full border border-white/30 transition-all text-lg transform hover:scale-105"
            >
              View Marketplace
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
