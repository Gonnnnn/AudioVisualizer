import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { type IVisualizer, type IVisualizerBar, type IVisualizerTheme } from '../../../types';
import { VISUALIZER_CONFIG, DEFAULT_BACKGROUND_COLOR } from '../../../config';

/**
 * A single visualizer bar in the circular layout
 */
class CircularBar implements IVisualizerBar {
  mesh: THREE.Mesh;

  constructor(geometry: THREE.BoxGeometry, material: THREE.Material) {
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update(value: number): void {
    const barHeight = Math.max(0.1, value * VISUALIZER_CONFIG.maxBarHeight);
    this.mesh.scale.y = barHeight;
    this.mesh.position.y = barHeight / 2;
  }
}

/**
 * Circular visualizer implementation
 */
export class CircularVisualizer implements IVisualizer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private orbitControls: OrbitControls;
  private bars: IVisualizerBar[] = [];
  private theme: IVisualizerTheme | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(DEFAULT_BACKGROUND_COLOR);
    
    // Initialize camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    
    // Set initial camera position
    this.camera.position.set(0, 15, 25);
    this.camera.lookAt(0, 0, 0);
    
    // Initialize controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
  }

  init(): void {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 25, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    this.scene.add(spotLight);
    
    // Create floor plane
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    this.scene.add(plane);
    
    // Create circular visualization bars
    this.createBars();
  }

  private createBars(): void {
    // Clear existing bars
    this.bars.forEach(bar => {
      if (bar.mesh) {
        this.scene.remove(bar.mesh);
      }
    });
    this.bars = [];
    
    // Number of bars
    const numBars = 64;
    
    // Create a circular arrangement of bars
    for (let i = 0; i < numBars; i++) {
      const barGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
      const barMaterial = new THREE.MeshStandardMaterial();
      
      const bar = new CircularBar(barGeometry, barMaterial);
      
      // Calculate position on circle
      const angle = (i / numBars) * Math.PI * 2;
      const radius = 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      bar.mesh.position.set(x, 0.5, z);
      
      // Apply theme if available
      if (this.theme) {
        this.theme.applyToBar(bar, i, numBars);
      }
      
      // Add to arrays and scene
      this.bars.push(bar);
      this.scene.add(bar.mesh);
    }
  }

  update(frequencyData: Uint8Array | null): void {
    // Update orbit controls
    this.orbitControls.update();
    
    if (frequencyData) {
      // Get a subset of frequency data for our bars
      const numBars = this.bars.length;
      const step = Math.floor(frequencyData.length / numBars);
      
      for (let i = 0; i < numBars; i++) {
        const index = i * step;
        if (index < frequencyData.length) {
          const value = frequencyData[index] / 255;
          this.bars[i].update(value);
        }
      }
    } else {
      // Decay bars when no audio is playing
      this.bars.forEach(bar => {
        if (bar.mesh.scale.y > 0.1) {
          bar.mesh.scale.y *= 0.95;
          bar.mesh.scale.y = Math.max(0.1, bar.mesh.scale.y);
          bar.mesh.position.y = bar.mesh.scale.y / 2;
        }
      });
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setTheme(theme: IVisualizerTheme): void {
    this.theme = theme;
    
    // Apply theme to all bars
    const totalBars = this.bars.length;
    this.bars.forEach((bar, index) => {
      this.theme?.applyToBar(bar, index, totalBars);
    });
  }

  destroy(): void {
    // Clean up resources
    this.bars.forEach(bar => {
      if (bar.mesh.geometry) bar.mesh.geometry.dispose();
      if (bar.mesh.material) {
        if (Array.isArray(bar.mesh.material)) {
          bar.mesh.material.forEach(material => material.dispose());
        } else {
          bar.mesh.material.dispose();
        }
      }
      this.scene.remove(bar.mesh);
    });
    
    this.bars = [];
    this.renderer.dispose();
  }
}