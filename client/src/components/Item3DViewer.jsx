import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Item3DViewer({ categoryName = 'Electronics', itemTitle = 'Item', imageUrl = null }) {
  const mountRef = useRef(null);
  const rootGroupRef = useRef(null);
  const [activeTab, setActiveTab] = useState('3d');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    if (activeTab !== '3d') return;
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

    const width = currentMount.clientWidth || 540;
    const height = 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08080a);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 2.0, 4.2);
    camera.lookAt(0, 0.2, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 4. Industrial Studio Turntable Plinth (Matte Titanium)
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const discGeom = new THREE.CylinderGeometry(1.65, 1.7, 0.08, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      roughness: 0.35,
      metalness: 0.6,
      wireframe
    });
    const disc = new THREE.Mesh(discGeom, discMat);
    disc.position.y = -0.7;
    stageGroup.add(disc);

    // Hairline Titanium Plinth Rim
    const rimGeom = new THREE.RingGeometry(1.48, 1.5, 64);
    rimGeom.rotateX(-Math.PI / 2);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x3f3f46, side: THREE.DoubleSide });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.y = -0.65;
    stageGroup.add(rim);

    // 5. Studio Key & Rim Lighting (Pure Neutral White)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4d4d8, 0.6);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const softBounce = new THREE.DirectionalLight(0x71717a, 0.3);
    softBounce.position.set(2, -2, 2);
    scene.add(softBounce);

    // 6. Category 3D Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    rootGroupRef.current = modelGroup;

    const cat = (categoryName || '').toLowerCase();

    if (cat.includes('electr') || cat.includes('laptop') || cat.includes('phone') || cat.includes('gadget')) {
      // Space Gray Aluminum Notebook
      const baseGeom = new THREE.BoxGeometry(1.7, 0.06, 1.2);
      const laptopMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        metalness: 0.85,
        roughness: 0.25,
        wireframe
      });
      const baseMesh = new THREE.Mesh(baseGeom, laptopMat);
      baseMesh.position.set(0, 0, 0.2);
      modelGroup.add(baseMesh);

      // Keyboard Recess
      const kbGeom = new THREE.PlaneGeometry(1.45, 0.7);
      const kbMat = new THREE.MeshBasicMaterial({ color: 0x18181b, wireframe });
      const kbMesh = new THREE.Mesh(kbGeom, kbMat);
      kbMesh.rotation.x = -Math.PI / 2;
      kbMesh.position.set(0, 0.035, 0.05);
      modelGroup.add(kbMesh);

      // Display Screen Lid
      const lidGeom = new THREE.BoxGeometry(1.7, 1.15, 0.05);
      const lidMesh = new THREE.Mesh(lidGeom, laptopMat);
      lidMesh.position.set(0, 0.54, -0.38);
      lidMesh.rotation.x = -0.22;
      modelGroup.add(lidMesh);

      // Gloss Display Glass
      const screenGeom = new THREE.PlaneGeometry(1.5, 0.95);
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x09090b, wireframe });
      const screenMesh = new THREE.Mesh(screenGeom, screenMat);
      screenMesh.position.set(0, 0.55, -0.35);
      screenMesh.rotation.x = -0.22;
      modelGroup.add(screenMesh);
    } else if (cat.includes('book') || cat.includes('notebook') || cat.includes('binder')) {
      // Academic Hardcover Book with Linen Texture
      const bookGeom = new THREE.BoxGeometry(1.4, 0.35, 1.85);
      const coverMat = new THREE.MeshStandardMaterial({
        color: 0x1f2026,
        roughness: 0.45,
        wireframe
      });
      const bookMesh = new THREE.Mesh(bookGeom, coverMat);
      modelGroup.add(bookMesh);

      const pagesGeom = new THREE.BoxGeometry(1.3, 0.26, 1.76);
      const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f5, roughness: 0.9, wireframe });
      const pagesMesh = new THREE.Mesh(pagesGeom, pagesMat);
      pagesMesh.position.x = 0.04;
      modelGroup.add(pagesMesh);

      // Platinum Ribbon Bookmark
      const ribbonGeom = new THREE.BoxGeometry(0.06, 0.02, 1.95);
      const ribbonMat = new THREE.MeshBasicMaterial({ color: 0xd4d4d8 });
      const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
      ribbon.position.set(-0.1, 0.18, 0.05);
      modelGroup.add(ribbon);
    } else if (cat.includes('id card') || cat.includes('card') || cat.includes('wallet') || cat.includes('badge')) {
      // Titanium Student Identity Badge
      const badgeGeom = new THREE.BoxGeometry(1.6, 1.05, 0.04);
      const badgeMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.4, wireframe });
      const badgeMesh = new THREE.Mesh(badgeGeom, badgeMat);
      modelGroup.add(badgeMesh);

      const photoGeom = new THREE.PlaneGeometry(0.5, 0.6);
      const photoMat = new THREE.MeshBasicMaterial({ color: 0x27272a, wireframe });
      const photoMesh = new THREE.Mesh(photoGeom, photoMat);
      photoMesh.position.set(-0.45, 0, 0.025);
      modelGroup.add(photoMesh);

      const clipGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
      const clipMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.9, roughness: 0.2 });
      const clip = new THREE.Mesh(clipGeom, clipMat);
      clip.rotation.z = Math.PI / 2;
      clip.position.set(0, 0.58, 0);
      modelGroup.add(clip);
    } else if (cat.includes('bottle') || cat.includes('flask') || cat.includes('tumbler')) {
      // Matte Stainless Vacuum Flask
      const bodyGeom = new THREE.CylinderGeometry(0.48, 0.48, 1.8, 32);
      const flaskMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.25, wireframe });
      const flask = new THREE.Mesh(bodyGeom, flaskMat);
      modelGroup.add(flask);

      const capGeom = new THREE.CylinderGeometry(0.42, 0.48, 0.35, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6 });
      const cap = new THREE.Mesh(capGeom, capMat);
      cap.position.y = 1.05;
      modelGroup.add(cap);
    } else if (cat.includes('key') || cat.includes('fob') || cat.includes('ring')) {
      // Titanium Carabiner & Split Keys
      const ringGeom = new THREE.TorusGeometry(0.65, 0.06, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.95, roughness: 0.15, wireframe });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      modelGroup.add(ring);

      const keyGeom = new THREE.BoxGeometry(0.18, 0.95, 0.04);
      const keyMesh = new THREE.Mesh(keyGeom, ringMat);
      keyMesh.position.set(0.3, -0.65, 0);
      keyMesh.rotation.z = -0.3;
      modelGroup.add(keyMesh);
    } else {
      // Clean Geometric Specimen Cube
      const cubeGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const cubeMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.35,
        metalness: 0.5,
        wireframe
      });
      const cube = new THREE.Mesh(cubeGeom, cubeMat);
      modelGroup.add(cube);

      const edges = new THREE.EdgesGeometry(cubeGeom);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x71717a });
      const line = new THREE.LineSegments(edges, lineMat);
      modelGroup.add(line);
    }

    // 7. Interactive Mouse Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.005;
      modelGroup.rotation.x = Math.max(-0.6, Math.min(0.6, modelGroup.rotation.x));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 8. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        modelGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeTab, categoryName, wireframe, autoRotate]);

  const resetRotation = () => {
    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.x = 0;
      rootGroupRef.current.rotation.y = 0;
    }
  };

  return (
    <div className="studio-stage-wrap">
      {/* Studio Viewport Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div className="apple-segmented-control">
          <button
            type="button"
            onClick={() => setActiveTab('3d')}
            className={'segmented-option ' + (activeTab === '3d' ? 'active' : '')}
          >
            3D Studio Turntable
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setActiveTab('photo')}
              className={'segmented-option ' + (activeTab === 'photo' ? 'active' : '')}
            >
              Original Photo Evidence
            </button>
          )}
        </div>

        {activeTab === '3d' && (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setWireframe(!wireframe)}
              className="btn-apple-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
            >
              {wireframe ? 'Shaded' : 'Wireframe'}
            </button>
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className="btn-apple-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
            >
              {autoRotate ? 'Pause' : 'Rotate'}
            </button>
            <button
              type="button"
              onClick={resetRotation}
              className="btn-apple-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Main Studio Viewport */}
      <div className="studio-viewport-canvas">
        {activeTab === '3d' ? (
          hasWebGL ? (
            <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#71717a' }}>
              WebGL 3D preview unavailable in this environment.
            </div>
          )
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}>
            <img src={imageUrl} alt={itemTitle} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
        )}
      </div>

      <div className="studio-controls-strip">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717a' }}>
          Interactive CAD Turntable • Click &amp; drag to examine
        </span>
        <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
          Class: {categoryName}
        </span>
      </div>
    </div>
  );
}
