import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const NDVIVisualization = ({ ndviData, siteId, heightScale = 10 }) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Mock NDVI data matrix if no data is provided
  const defaultData = [
    [0.21, 0.22, 0.24, 0.25, 0.23, 0.21, 0.2, 0.22, 0.23, 0.25],
    [0.25, 0.26, 0.28, 0.3, 0.32, 0.29, 0.26, 0.28, 0.29, 0.27],
    [0.28, 0.33, 0.38, 0.42, 0.4, 0.36, 0.32, 0.3, 0.31, 0.29],
    [0.3, 0.35, 0.45, 0.52, 0.55, 0.49, 0.38, 0.32, 0.3, 0.29],
    [0.28, 0.34, 0.42, 0.58, 0.62, 0.54, 0.42, 0.34, 0.29, 0.27],
    [0.27, 0.31, 0.38, 0.48, 0.52, 0.48, 0.4, 0.32, 0.28, 0.26],
    [0.25, 0.28, 0.3, 0.36, 0.42, 0.4, 0.35, 0.3, 0.26, 0.24],
    [0.23, 0.25, 0.26, 0.29, 0.32, 0.33, 0.3, 0.27, 0.25, 0.23],
    [0.21, 0.22, 0.23, 0.24, 0.26, 0.27, 0.25, 0.24, 0.22, 0.21],
    [0.19, 0.2, 0.21, 0.22, 0.23, 0.22, 0.21, 0.2, 0.19, 0.18],
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x888888);
    scene.add(gridHelper);

    // Use provided NDVI data or fallback to default
    const gridData = ndviData || defaultData;

    // Create terrain mesh from NDVI data
    const terrainGeometry = new THREE.PlaneGeometry(
      10,
      10,
      gridData.length - 1,
      gridData[0].length - 1
    );
    terrainGeometry.rotateX(-Math.PI / 2);

    // Set height of each vertex based on NDVI value
    const positionAttribute = terrainGeometry.getAttribute("position");
    const vertices = positionAttribute.array;

    let minNDVI = 0.2;
    let maxNDVI = 0.6;

    // Find min and max NDVI values
    gridData.forEach((row) => {
      row.forEach((value) => {
        minNDVI = Math.min(minNDVI, value);
        maxNDVI = Math.max(maxNDVI, value);
      });
    });

    // Set vertex heights based on NDVI values
    for (let i = 0; i < gridData.length; i++) {
      for (let j = 0; j < gridData[i].length; j++) {
        const ndviValue = gridData[i][j];
        const vertexIndex = i * gridData[i].length + j;
        const heightNormalized = (ndviValue - minNDVI) / (maxNDVI - minNDVI);
        vertices[vertexIndex * 3 + 2] = heightNormalized * heightScale;
      }
    }

    positionAttribute.needsUpdate = true;
    terrainGeometry.computeVertexNormals();

    // Create material with color gradient based on height
    const terrainMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
    });

    // Add vertex colors based on height
    const colors = [];

    for (let i = 0; i < vertices.length / 3; i++) {
      const height = vertices[i * 3 + 2];
      const normalizedHeight = height / heightScale;

      // Color gradient from red (low NDVI) to green (high NDVI)
      if (normalizedHeight < 0.25) {
        // Red to yellow
        colors.push(1.0, normalizedHeight * 4, 0);
      } else if (normalizedHeight < 0.5) {
        // Yellow to light green
        colors.push(2.0 - normalizedHeight * 4, 1.0, 0);
      } else if (normalizedHeight < 0.75) {
        // Light green to green
        colors.push(0, 1.0, (normalizedHeight - 0.5) * 4);
      } else {
        // Green to dark green
        colors.push(0, 2.0 - normalizedHeight * 4, 1.0);
      }
    }

    terrainGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Create terrain mesh
    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.position.set(-5, 0, -5);
    scene.add(terrain);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add site label
    const siteName = siteId ? `Site ${siteId}` : "NDVI Visualization";

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);

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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [ndviData, siteId, heightScale]);

  return (
    <div className="flex flex-col">
      <div className="bg-green-800 text-white p-3 text-center font-semibold rounded-t-lg">
        3D NDVI Visualization {siteId && `- Site ${siteId}`}
      </div>

      <div
        ref={containerRef}
        className="w-full h-[400px] border border-gray-200 rounded-b-lg relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded-md backdrop-blur-sm text-sm shadow-md">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500"></span>
            <span>Low NDVI</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500"></span>
            <span>Medium NDVI</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500"></span>
            <span>High NDVI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NDVIVisualization;
