/*
  INTERACTIVE THREE.JS BACKGROUND
  Cool patterns, effects, and interactive elements with intensity control
*/

class InteractiveThreeJSBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.time = 0;
    this.isLightTheme = false;
    this.mouse = new THREE.Vector2();
    this.intensity = 1.0; // 0 to 1 - Maximum intensity for professional look
    this.animationSpeed = 1.5; // 0 to 2 - Faster animations
    
    // Elements
    this.particles = null;
    this.geometries = [];
    this.waveGeometry = null;
    this.neuralNetwork = [];
    this.connectionLines = [];
    this.floatingIcons = [];
    this.particleBursts = [];
    
    // Dynamic instancing
    this.instancedMesh = null;
    this.instanceCount = window.innerWidth < 768 ? 500 : 800; // Reduced for mobile
    this.instanceMatrix = null;
    
    if (typeof THREE === 'undefined') {
      console.error('Three.js is not loaded!');
      return;
    }
    
    this.init();
    this.createParticleSystem();
    this.createGeometricShapes();
    this.createWavePattern();
    this.createNeuralNetwork();
    this.createFloatingIcons();
    this.createDynamicInstancing();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;
    
    // Create renderer
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) {
      console.error('Background canvas not found!');
      return;
    }
    
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: canvas, 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 5);
    this.scene.add(directionalLight);
  }




  createParticleSystem() {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 100 : 300; // Reduced for better performance
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Theme-aware colors
      const color = new THREE.Color();
      if (this.isLightTheme) {
        color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.8);
      } else {
        color.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6);
      }
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createGeometricShapes() {
    const shapes = [
      { type: 'sphere', size: 0.3, position: [-4, -2, -3], color: 0x0092A2 },
      { type: 'octahedron', size: 0.4, position: [0, 3, -4], color: 0x017481 },
      { type: 'box', size: 0.4, position: [4, 2, -2], color: 0x81B7B6 },
      { type: 'tetrahedron', size: 0.3, position: [-2, 1, -5], color: 0x0092A2 },
      { type: 'cone', size: 0.3, position: [2, -1, -4], color: 0x017481 }
    ];
    
    shapes.forEach((shape, index) => {
      let geometry;
      
      switch (shape.type) {
        case 'box':
          geometry = new THREE.BoxGeometry(shape.size, shape.size, shape.size);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(shape.size, 16, 16);
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(shape.size);
          break;
        case 'tetrahedron':
          geometry = new THREE.TetrahedronGeometry(shape.size);
          break;
        case 'cone':
          geometry = new THREE.ConeGeometry(shape.size, shape.size * 2, 8);
          break;
      }
      
      const material = new THREE.MeshPhongMaterial({
        color: shape.color,
        transparent: true,
        opacity: 0.7,
        wireframe: true,
        shininess: 100
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...shape.position);
      mesh.userData = { 
        originalPosition: [...shape.position], 
        rotationSpeed: 0.005 + Math.random() * 0.005,
        floatSpeed: 0.005 + Math.random() * 0.005,
        floatOffset: Math.random() * Math.PI * 2,
        color: shape.color
      };
      
      this.geometries.push(mesh);
      this.scene.add(mesh);
    });
  }

  createWavePattern() {
    const waveGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    const waveMaterial = new THREE.MeshPhongMaterial({
      color: 0x0092A2,
      transparent: true,
      opacity: 0.1 + (this.intensity * 0.1),
      wireframe: true,
      side: THREE.DoubleSide
    });
    
    this.waveGeometry = new THREE.Mesh(waveGeometry, waveMaterial);
    this.waveGeometry.rotation.x = -Math.PI / 2;
    this.waveGeometry.position.z = -8;
    this.scene.add(this.waveGeometry);
  }

  createNeuralNetwork() {
    const layers = [5, 8, 6, 4];
    let nodeIndex = 0;
    
    layers.forEach((nodeCount, layerIndex) => {
      const layerNodes = [];
      
      for (let i = 0; i < nodeCount; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const nodeMaterial = new THREE.MeshPhongMaterial({
          color: 0x81B7B6,
          transparent: true,
          opacity: 0.3 + (this.intensity * 0.4)
        });
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        
        const x = (layerIndex - layers.length / 2) * 2;
        const y = (i - nodeCount / 2) * 0.5;
        const z = -6;
        
        node.position.set(x, y, z);
        node.userData = {
          originalPosition: { x, y, z },
          layerIndex,
          nodeIndex: i,
          pulseSpeed: 0.02 + Math.random() * 0.03
        };
        
        layerNodes.push(node);
        this.neuralNetwork.push(node);
        this.scene.add(node);
        nodeIndex++;
      }
    });
    
    // Create connections between layers
    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayerNodes = this.neuralNetwork.filter(n => n.userData.layerIndex === i);
      const nextLayerNodes = this.neuralNetwork.filter(n => n.userData.layerIndex === i + 1);
      
      currentLayerNodes.forEach(currentNode => {
        nextLayerNodes.forEach(nextNode => {
          const connectionGeometry = new THREE.BufferGeometry();
          const positions = new Float32Array([
            currentNode.position.x, currentNode.position.y, currentNode.position.z,
            nextNode.position.x, nextNode.position.y, nextNode.position.z
          ]);
          connectionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          
          const connectionMaterial = new THREE.LineBasicMaterial({
            color: 0x017481,
            transparent: true,
            opacity: 0.1 + (this.intensity * 0.2)
          });
          
          const connection = new THREE.Line(connectionGeometry, connectionMaterial);
          this.connectionLines.push(connection);
          this.scene.add(connection);
        });
      });
    }
  }

  createFloatingIcons() {
    const iconTypes = ['code', 'ai', 'data', 'web', 'research'];
    
    iconTypes.forEach((iconType, index) => {
      const iconGeometry = new THREE.OctahedronGeometry(0.2);
      const iconMaterial = new THREE.MeshPhongMaterial({
        color: 0x0092A2,
        transparent: true,
        opacity: 0.4 + (this.intensity * 0.3),
        emissive: 0x001A1F,
        emissiveIntensity: 0.2
      });
      
      const icon = new THREE.Mesh(iconGeometry, iconMaterial);
      
      const angle = (index / iconTypes.length) * Math.PI * 2;
      const radius = 8;
      icon.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.3,
        -3
      );
      
      icon.userData = {
        originalPosition: icon.position.clone(),
        rotationSpeed: 0.01 + Math.random() * 0.01,
        orbitSpeed: 0.005 + Math.random() * 0.005,
        orbitOffset: angle
      };
      
      this.floatingIcons.push(icon);
      this.scene.add(icon);
    });
  }

  createDynamicInstancing() {
    // Create geometry for instanced objects
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    
    // Create material with theme-aware colors
        const material = new THREE.MeshPhongMaterial({
            color: this.isLightTheme ? 0x017481 : 0x0092A2,
            transparent: true,
            opacity: 0.8
        });
    
    // Create instanced mesh
    this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.instanceCount);
    
    // Create matrix array for instances
    this.instanceMatrix = new THREE.InstancedBufferAttribute(
      new Float32Array(this.instanceCount * 16), 16
    );
    
    // Initialize instance positions and rotations
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();
    
    for (let i = 0; i < this.instanceCount; i++) {
      // Random positions in a large area
      position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 10
      );
      
      // Random rotations
      rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Random scales
      const scaleValue = 0.5 + Math.random() * 1.5;
      scale.set(scaleValue, scaleValue, scaleValue);
      
      // Set matrix
      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      this.instancedMesh.setMatrixAt(i, matrix);
      
      // Store instance data for animation
      this.instancedMesh.userData = this.instancedMesh.userData || {};
      this.instancedMesh.userData.instances = this.instancedMesh.userData.instances || [];
      this.instancedMesh.userData.instances[i] = {
        position: position.clone(),
        rotation: rotation.clone(),
        scale: scale.clone(),
        originalPosition: position.clone(),
        originalRotation: rotation.clone(),
        speed: 0.5 + Math.random() * 1.5,
        rotationSpeed: 0.01 + Math.random() * 0.02,
        floatSpeed: 0.005 + Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2
      };
    }
    
    // Update matrix
    this.instancedMesh.instanceMatrix.needsUpdate = true;
    
    this.scene.add(this.instancedMesh);
  }

  setupEventListeners() {
    // Mouse movement for interactive effects
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Click for particle bursts
    window.addEventListener('click', (event) => {
      this.createParticleBurst(event.clientX, event.clientY);
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Theme change detection
    const observer = new MutationObserver(() => {
      this.isLightTheme = document.body.classList.contains('light-theme');
      this.updateThemeColors();
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  createParticleBurst(x, y) {
    const burstCount = 20;
    const burstGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(burstCount * 3);
    const colors = new Float32Array(burstCount * 3);
    
    // Convert screen coordinates to normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    
    // Convert to world coordinates using camera
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    
    // Get the intersection point at z = 0 (where particles should appear)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    
    for (let i = 0; i < burstCount; i++) {
      const i3 = i * 3;
      
      // Create burst around the intersection point
      const angle = (i / burstCount) * Math.PI * 2;
      const radius = Math.random() * 0.5;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      
      positions[i3] = intersectionPoint.x + offsetX;
      positions[i3 + 1] = intersectionPoint.y + offsetY;
      positions[i3 + 2] = intersectionPoint.z + (Math.random() - 0.5) * 0.2;
      
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    burstGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    burstGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const burstMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });
    
    const burst = new THREE.Points(burstGeometry, burstMaterial);
    burst.userData = {
      life: 1.0,
      decay: 0.02,
      velocity: positions.slice()
    };
    
    this.particleBursts.push(burst);
    this.scene.add(burst);
  }

  updateThemeColors() {
    // Update particle colors
    if (this.particles) {
      const colors = this.particles.geometry.attributes.color.array;
      for (let i = 0; i < colors.length; i += 3) {
        const color = new THREE.Color();
        if (this.isLightTheme) {
          color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.8);
        } else {
          color.setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6);
        }
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }
      this.particles.geometry.attributes.color.needsUpdate = true;
    }

    // Update geometric shapes
    this.geometries.forEach(mesh => {
      mesh.material.color.setHex(this.isLightTheme ? 0x017481 : 0x0092A2);
    });
  }

  animate() {
    if (!this.renderer) return;
    
    requestAnimationFrame(() => this.animate());
    
    this.time = this.clock.getElapsedTime() * this.animationSpeed;
    
    // Mouse interaction with camera
    this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
    this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.02;
    
    // Animate particles with mouse interaction
    if (this.particles) {
      this.particles.rotation.y += 0.001;
      this.particles.rotation.x += 0.0005;
      
      // Mouse influence on particles
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const distance = Math.sqrt(
          Math.pow(positions[i] - this.mouse.x * 10, 2) + 
          Math.pow(positions[i + 1] - this.mouse.y * 10, 2)
        );
        
        if (distance < 3) {
          const force = (3 - distance) / 3;
          positions[i + 2] += Math.sin(this.time * 10) * force * 0.1;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate geometric shapes with enhanced effects
    this.geometries.forEach(mesh => {
      mesh.rotation.x += mesh.userData.rotationSpeed * 2;
      mesh.rotation.y += mesh.userData.rotationSpeed * 1.4;
      mesh.rotation.z += mesh.userData.rotationSpeed * 0.6;
      
      // Enhanced floating animation
      const floatY = Math.sin(this.time * mesh.userData.floatSpeed * 2 + mesh.userData.floatOffset) * 1.2;
      const floatX = Math.cos(this.time * mesh.userData.floatSpeed * 1.6 + mesh.userData.floatOffset) * 0.8;
      
      mesh.position.y = mesh.userData.originalPosition[1] + floatY;
      mesh.position.x = mesh.userData.originalPosition[0] + floatX;
      mesh.position.z = mesh.userData.originalPosition[2] + 
        Math.sin(this.time * mesh.userData.floatSpeed * 0.5 + mesh.userData.floatOffset) * 0.3;
      
      // Mouse influence
      const mouseDistance = Math.sqrt(
        Math.pow(mesh.position.x - this.mouse.x * 10, 2) + 
        Math.pow(mesh.position.y - this.mouse.y * 10, 2)
      );
      
      if (mouseDistance < 5) {
        const attraction = (5 - mouseDistance) / 5;
        mesh.position.x += (this.mouse.x * 10 - mesh.position.x) * attraction * 0.01;
        mesh.position.y += (this.mouse.y * 10 - mesh.position.y) * attraction * 0.01;
        mesh.material.opacity = Math.min(0.8, 0.1 + (this.intensity * 0.2) + attraction * 0.3);
      }
    });
    
    // Animate wave pattern
    if (this.waveGeometry) {
      const positions = this.waveGeometry.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x * 0.5 + this.time * 2) * 0.5 + 
                          Math.cos(y * 0.3 + this.time * 1.5) * 0.3;
      }
      this.waveGeometry.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animate neural network
    this.neuralNetwork.forEach(node => {
      const pulse = Math.sin(this.time * node.userData.pulseSpeed + node.userData.nodeIndex) * 0.5 + 0.5;
      node.scale.setScalar(0.5 + pulse * 0.5);
      
      // Mouse influence on neural nodes
      const mouseDistance = Math.sqrt(
        Math.pow(node.position.x - this.mouse.x * 10, 2) + 
        Math.pow(node.position.y - this.mouse.y * 10, 2)
      );
      
      if (mouseDistance < 3) {
        node.material.opacity = Math.min(1, 0.3 + (this.intensity * 0.4) + 0.3);
        node.material.color.setHex(0x0092A2);
      } else {
        node.material.color.setHex(0x81B7B6);
      }
    });
    
    // Animate floating icons
    this.floatingIcons.forEach(icon => {
      icon.rotation.x += icon.userData.rotationSpeed;
      icon.rotation.y += icon.userData.rotationSpeed * 0.7;
      
      // Orbital motion
      const newAngle = icon.userData.orbitOffset + this.time * icon.userData.orbitSpeed;
      icon.position.x = Math.cos(newAngle) * 8;
      icon.position.y = Math.sin(newAngle) * 8 * 0.3;
      
      // Mouse attraction
      const mouseDistance = Math.sqrt(
        Math.pow(icon.position.x - this.mouse.x * 10, 2) + 
        Math.pow(icon.position.y - this.mouse.y * 10, 2)
      );
      
      if (mouseDistance < 4) {
        const attraction = (4 - mouseDistance) / 4;
        icon.position.z = -3 + attraction * 2;
        icon.material.emissiveIntensity = 0.2 + attraction * 0.3;
      } else {
        icon.position.z = -3;
        icon.material.emissiveIntensity = 0.2;
      }
    });
    
    // Animate particle bursts
    this.particleBursts.forEach((burst, index) => {
      burst.userData.life -= burst.userData.decay;
      burst.material.opacity = burst.userData.life;
      
      if (burst.userData.life <= 0) {
        this.scene.remove(burst);
        this.particleBursts.splice(index, 1);
        burst.geometry.dispose();
        burst.material.dispose();
      } else {
        const positions = burst.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += (Math.random() - 0.5) * 0.1;
          positions[i + 1] += (Math.random() - 0.5) * 0.1;
          positions[i + 2] += (Math.random() - 0.5) * 0.1;
        }
        burst.geometry.attributes.position.needsUpdate = true;
      }
    });
    
    // Animate instanced mesh
    if (this.instancedMesh && this.instancedMesh.userData.instances) {
      const matrix = new THREE.Matrix4();
      
      this.instancedMesh.userData.instances.forEach((instance, i) => {
        // Update rotation
      instance.rotation.x += instance.rotationSpeed * 2;
      instance.rotation.y += instance.rotationSpeed * 1.4;
      instance.rotation.z += instance.rotationSpeed * 0.6;
        
        // Floating animation
        instance.position.y = instance.originalPosition.y + 
          Math.sin(this.time * instance.floatSpeed * 2 + instance.floatOffset) * 3;
        instance.position.x = instance.originalPosition.x + 
          Math.cos(this.time * instance.floatSpeed * 1.6 + instance.floatOffset) * 2;
        instance.position.z = instance.originalPosition.z + 
          Math.sin(this.time * instance.floatSpeed * 1 + instance.floatOffset) * 2;
        
        // Mouse interaction
        const mouseDistance = Math.sqrt(
          Math.pow(instance.position.x - this.mouse.x * 20, 2) + 
          Math.pow(instance.position.y - this.mouse.y * 20, 2)
        );
        
        if (mouseDistance < 8) {
          const attraction = (8 - mouseDistance) / 8;
          instance.position.x += (this.mouse.x * 20 - instance.position.x) * attraction * 0.02;
          instance.position.y += (this.mouse.y * 20 - instance.position.y) * attraction * 0.02;
          instance.position.z += attraction * 2;
          
          // Scale up when near mouse
          const scaleFactor = 1 + attraction * 0.5;
          instance.scale.setScalar(scaleFactor);
        } else {
          // Return to original scale
          instance.scale.setScalar(instance.originalScale || 1);
        }
        
        // Update matrix
        matrix.compose(
          instance.position, 
          new THREE.Quaternion().setFromEuler(instance.rotation), 
          instance.scale
        );
        this.instancedMesh.setMatrixAt(i, matrix);
      });
      
      this.instancedMesh.instanceMatrix.needsUpdate = true;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    this.scene.traverse(object => {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
    
    this.scene.clear();
  }
}

// Initialize background with error handling
document.addEventListener('DOMContentLoaded', () => {
  const checkThreeJS = () => {
    if (typeof THREE !== 'undefined') {
      try {
        setTimeout(() => {
          window.interactiveThreeJSBackground = new InteractiveThreeJSBackground();
        }, 500);
      } catch (error) {
        console.warn('Three.js background initialization failed:', error);
        // Fallback: hide canvas if Three.js fails
        const canvas = document.getElementById('bg-canvas');
        if (canvas) {
          canvas.style.display = 'none';
        }
      }
    } else {
      setTimeout(checkThreeJS, 100);
    }
  };
  
  checkThreeJS();
});

// Clean up
window.addEventListener('beforeunload', () => {
  if (window.interactiveThreeJSBackground) {
    window.interactiveThreeJSBackground.destroy();
  }
});