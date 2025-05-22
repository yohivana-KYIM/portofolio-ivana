
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 1;
    
    // Create renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    
    // Create laptop body
    const laptopBody = new THREE.Group();
    
    // Create laptop screen (slightly larger box)
    const screenGeometry = new THREE.BoxGeometry(3, 2, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222,
      shininess: 100,
      specular: 0xffffff
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    laptopBody.add(screen);
    
    // Create laptop keyboard base
    const baseGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x333333,
      shininess: 50,
      specular: 0x888888
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.05;
    base.position.z = 1;
    laptopBody.add(base);
    
    // Create screen display (a plane slightly in front of the screen)
    const displayGeometry = new THREE.PlaneGeometry(2.8, 1.8);
    const displayMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x121212,
      transparent: true,
      opacity: 0.9
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.position.z = 0.06;
    screen.add(display);
    
    // Create code lines on screen
    const createCodeLine = (y: number, width: number, color: string) => {
      const lineGeometry = new THREE.PlaneGeometry(width, 0.05);
      const lineMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.7
      });
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.y = y;
      line.position.z = 0.01;
      return line;
    };
    
    // Add multiple code lines with different colors and positions
    const codeLines: THREE.Mesh[] = [];
    const colors = ['#d4c2fc', '#a3e4db', '#ffffff', '#d4c2fc'];
    
    for (let i = 0; i < 18; i++) {
      const y = 0.8 - (i * 0.1);
      const width = 0.5 + Math.random() * 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const line = createCodeLine(y, width, color);
      line.position.x = -1.2 + Math.random() * 0.4;
      display.add(line);
      codeLines.push(line);
    }
    
    // Add laptop to scene
    scene.add(laptopBody);
    
    // Create wireframe icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const wireframe = new THREE.WireframeGeometry(icosahedronGeometry);
    const line = new THREE.LineSegments(wireframe);
    line.material = new THREE.LineBasicMaterial({
      color: 0xd4c2fc,
      linewidth: 1.5,
    });
    line.position.x = 3;
    line.position.z = -2;
    scene.add(line);
    
    // Add floating spheres
    const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xa3e4db,
      shininess: 100,
      specular: 0xffffff
    });
    
    // Create multiple small spheres
    const spheres: THREE.Mesh[] = [];
    for(let i = 0; i < 12; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // Position them randomly around the laptop
      sphere.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      // Give each their own "orbit"
      sphere.userData = {
        orbit: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.01,
        radius: 0.5 + Math.random() * 2,
        yFactor: Math.random() * 2
      };
      spheres.push(sphere);
      scene.add(sphere);
    }
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light from front
    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);
    
    // Add point light for purple glow
    const pointLight = new THREE.PointLight(0xd4c2fc, 1, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
    
    // Add point light for teal glow
    const pointLight2 = new THREE.PointLight(0xa3e4db, 1, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate laptop
      laptopBody.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
      laptopBody.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
      
      // Animate code lines - make them "type"
      codeLines.forEach((line, index) => {
        const scale = Math.sin((Date.now() * 0.001) + index) * 0.2 + 0.8;
        line.scale.x = scale;
      });
      
      // Rotate wireframe
      line.rotation.x += 0.002;
      line.rotation.y += 0.003;
      
      // Animate each sphere on its own path
      spheres.forEach(sphere => {
        const { orbit, speed, radius, yFactor } = sphere.userData;
        sphere.userData.orbit += speed;
        
        sphere.position.x = Math.cos(sphere.userData.orbit) * radius;
        sphere.position.z = Math.sin(sphere.userData.orbit) * radius;
        sphere.position.y = Math.sin(sphere.userData.orbit * yFactor) * radius / 2;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };
      
      laptopBody.rotation.y += deltaMove.x * 0.005;
      laptopBody.rotation.x += deltaMove.y * 0.005;
      
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    const handleMouseUp = () => {
      isDragging = false;
    };
    
    // Add touch interaction for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.x,
        y: e.touches[0].clientY - previousMousePosition.y
      };
      
      laptopBody.rotation.y += deltaMove.x * 0.005;
      laptopBody.rotation.x += deltaMove.y * 0.005;
      
      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };
    
    const handleTouchEnd = () => {
      isDragging = false;
    };
    
    containerRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    containerRef.current.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousedown', handleMouseDown);
        containerRef.current.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      screenGeometry.dispose();
      screenMaterial.dispose();
      baseGeometry.dispose();
      baseMaterial.dispose();
      displayGeometry.dispose();
      displayMaterial.dispose();
      icosahedronGeometry.dispose();
      wireframe.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      
      codeLines.forEach(line => {
        (line.geometry as THREE.BufferGeometry).dispose();
        (line.material as THREE.Material).dispose();
      });
      
      spheres.forEach(sphere => {
        (sphere.material as THREE.Material).dispose();
      });
    };
  }, []);
  
  return <div ref={containerRef} className={className} />;
};

export default ThreeScene;
