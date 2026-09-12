import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CAMPUS_ZONES = [
  { id: 'Central Library', name: 'Central Library', short: 'Library', x: -4.5, z: -3, w: 3.4, h: 2.4, d: 2.8 },
  { id: 'Student Cafeteria', name: 'Student Cafeteria', short: 'Dining & Union', x: 4.2, z: -3.2, w: 3.2, h: 1.6, d: 2.8 },
  { id: 'Engineering Lab 104', name: 'Engineering Lab', short: 'Tech Complex', x: -4.2, z: 3.5, w: 3.6, h: 3.0, d: 2.4 },
  { id: 'Sports Complex Pavilion', name: 'Sports Complex', short: 'Athletics Arena', x: 4.4, z: 3.4, w: 3.8, h: 1.8, d: 2.6 },
  { id: 'Seminar Hall A', name: 'Seminar Hall & Admin', short: 'Founders Hall', x: 0, z: 0.2, w: 3.0, h: 3.6, d: 2.8 }
];

export default function CampusSpatial3D({ items = [], onSelectLocation, selectedLocation }) {
  const mountRef = useRef(null);
  const rootGroupRef = useRef(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Compute live item counts per zone
  const zoneStats = React.useMemo(() => {
    const stats = {};
    CAMPUS_ZONES.forEach((z) => {
      stats[z.id] = { total: 0, lost: 0, found: 0 };
    });
    items.forEach((item) => {
      const loc = item.location || '';
      CAMPUS_ZONES.forEach((z) => {
        if (loc.toLowerCase().includes(z.name.toLowerCase()) || loc.toLowerCase().includes(z.id.toLowerCase())) {
          stats[z.id].total += 1;
          if (item.type === 'LOST') stats[z.id].lost += 1;
          if (item.type === 'FOUND') stats[z.id].found += 1;
        }
      });
    });
    return stats;
  }, [items]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const width = currentMount.clientWidth || 1200;
    const height = 360;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08080a);

    // 2. Camera: Isometric high-angle architectural view
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(15, 16, 16);
    camera.lookAt(0, 0.8, 0);

    // 3. Renderer with high DPR
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 4. Architectural CAD Ground Grid
    const gridHelper = new THREE.GridHelper(26, 26, 0x27272a, 0x141418);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Subtle Titanium Floor Disc
    const discGeom = new THREE.CylinderGeometry(13.5, 13.5, 0.05, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d10,
      roughness: 0.6,
      metalness: 0.3
    });
    const disc = new THREE.Mesh(discGeom, discMat);
    disc.position.y = -0.03;
    scene.add(disc);

    // Outer Perimeter Hairline Ring
    const ringGeom = new THREE.RingGeometry(13.4, 13.45, 64);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x27272a, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.y = 0.002;
    scene.add(ringMesh);

    // 5. Studio Architectural Lighting (Pure Crisp White & Soft Shadows)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keySunlight = new THREE.DirectionalLight(0xffffff, 1.4);
    keySunlight.position.set(20, 28, 16);
    scene.add(keySunlight);

    const softFillLight = new THREE.DirectionalLight(0xa1a1aa, 0.4);
    softFillLight.position.set(-18, 12, -16);
    scene.add(softFillLight);

    // 6. Buildings & Pins
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    const interactiveMeshes = [];
    const pinMeshes = [];

    CAMPUS_ZONES.forEach((zone) => {
      const isSelected = selectedLocation && selectedLocation.toLowerCase().includes(zone.name.toLowerCase());

      // Frosted Architectural Volumes (Matte Charcoal & Titanium)
      const geom = new THREE.BoxGeometry(zone.w, zone.h, zone.d);
      const mat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x2e3038 : 0x18191f,
        roughness: 0.25,
        metalness: 0.4,
        transparent: true,
        opacity: isSelected ? 0.95 : 0.8
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(zone.x, zone.h / 2, zone.z);
      mesh.userData = { zone };
      rootGroup.add(mesh);
      interactiveMeshes.push(mesh);

      // Clean Precision Architectural Edges
      const edges = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xffffff : 0x3f3f46,
        linewidth: 1
      });
      const line = new THREE.LineSegments(edges, lineMat);
      line.position.copy(mesh.position);
      rootGroup.add(line);

      // Matte Roof Deck
      const roofGeom = new THREE.BoxGeometry(zone.w * 0.88, 0.12, zone.d * 0.88);
      const roofMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x3a3c46 : 0x121316,
        roughness: 0.7
      });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.position.set(zone.x, zone.h + 0.06, zone.z);
      rootGroup.add(roof);

      // Clean Minimalist CAD Marker
      const stats = zoneStats[zone.id] || { total: 0, lost: 0, found: 0 };
      if (stats.total > 0) {
        const markerColor = stats.lost > 0 ? 0xf43f5e : 0x10b981;

        // Geometric Minimalist Marker Pin
        const pinGeom = new THREE.OctahedronGeometry(0.24, 0);
        const pinMat = new THREE.MeshStandardMaterial({
          color: markerColor,
          roughness: 0.2,
          metalness: 0.5
        });
        const pinHead = new THREE.Mesh(pinGeom, pinMat);
        pinHead.position.set(zone.x, zone.h + 0.9, zone.z);
        pinHead.userData = { initialY: zone.h + 0.9, zone };
        rootGroup.add(pinHead);
        pinMeshes.push(pinHead);

        // Subtle Plinth Indicator Ring
        const groundRingGeom = new THREE.RingGeometry(0.28, 0.36, 24);
        groundRingGeom.rotateX(-Math.PI / 2);
        const groundRingMat = new THREE.MeshBasicMaterial({
          color: markerColor,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide
        });
        const groundRing = new THREE.Mesh(groundRingGeom, groundRingMat);
        groundRing.position.set(zone.x, 0.015, zone.z);
        rootGroup.add(groundRing);
      }
    });

    // 7. Mouse Orbit
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        rootGroup.rotation.y += deltaX * 0.005;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const target = intersects[0].object.userData.zone;
        setHoveredZone(target);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredZone(null);
        renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0 && onSelectLocation) {
        const zone = intersects[0].object.userData.zone;
        onSelectLocation(zone.name);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('click', onClick);

    // 8. Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        rootGroup.rotation.y += 0.001;
      }

      pinMeshes.forEach((pin, i) => {
        pin.position.y = pin.userData.initialY + Math.sin(elapsedTime * 2 + i) * 0.08;
        pin.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [items, selectedLocation, autoRotate, zoneStats, onSelectLocation]);

  const resetCamera = () => {
    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.y = 0;
    }
  };

  if (!hasWebGL) return null;

  return (
    <div className="spatial-full-stage">
      <div ref={mountRef} className="spatial-canvas-mount" />

      {/* Minimalist Studio HUD */}
      <div className="spatial-floating-hud">
        <div className="hud-zone-pill">
          {hoveredZone ? (
            <span>
              <strong style={{ color: '#ffffff' }}>{hoveredZone.name}</strong> •{' '}
              {zoneStats[hoveredZone.id]?.total || 0} active report(s)
            </span>
          ) : (
            <span>
              <strong style={{ color: '#ffffff' }}>Campus 3D Twin</strong> • Click zone or drag to orbit
            </span>
          )}
        </div>

        <div className="hud-controls-pill">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            {autoRotate ? 'Pause' : 'Rotate'}
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={resetCamera}
            style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Zone Filter Strip Underneath */}
      <div className="zone-filter-strip">
        <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 600, paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Locations:
        </span>
        <button
          type="button"
          onClick={() => onSelectLocation && onSelectLocation('')}
          className={'zone-filter-btn ' + (!selectedLocation ? 'active' : '')}
        >
          All Locations ({items.length})
        </button>
        {CAMPUS_ZONES.map((zone) => {
          const isSelected = selectedLocation && selectedLocation.toLowerCase().includes(zone.name.toLowerCase());
          const count = zoneStats[zone.id]?.total || 0;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelectLocation && onSelectLocation(zone.name)}
              className={'zone-filter-btn ' + (isSelected ? 'active' : '')}
            >
              {zone.short} {count > 0 ? '(' + count + ')' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
