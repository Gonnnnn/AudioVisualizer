import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { type IVisualizer, type IVisualizerBar, type IVisualizerTheme } from '../../../types';
import { VISUALIZER_CONFIG, DEFAULT_BACKGROUND_COLOR } from '../../../config';

/**
 * A single visualizer bar in the grid
 */
class VisualizerBar implements IVisualizerBar {
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
 * Grid visualizer implementation
 */
export class GridVisualizer implements IVisualizer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private orbitControls: OrbitControls;
  private bars: VisualizerBar[] = [];
  private theme: IVisualizerTheme | null = null;
  private gridHelper: THREE.GridHelper | null = null;

  constructor(canvas: HTMLCanvasElement) {
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
    const gridSize = VISUALIZER_CONFIG.gridSize;
    const barSpacing = VISUALIZER_CONFIG.barSpacing;
    const cameraInitialZ = gridSize * barSpacing * 0.8;
    const cameraInitialY = gridSize * barSpacing * 0.5;
    this.camera.position.set(0, cameraInitialY, cameraInitialZ);
    this.camera.lookAt(0, 0, 0);
    
    // Initialize controls
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.orbitControls.minDistance = 5;
    this.orbitControls.maxDistance = cameraInitialZ * 2;
  }

  init(): void {
    // Add lighting
    this.addLighting();
    
    // Create grid
    this.createGrid();
    
    // Create bars
    this.createBars();
  }

  private addLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
  }

  private createGrid(): void {
    const { gridSize, barSpacing } = VISUALIZER_CONFIG;
    const totalGridSize = gridSize * barSpacing;
    const divisions = gridSize;
    
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
    }
    
    this.gridHelper = new THREE.GridHelper(totalGridSize, divisions, 0x00FFFF, 0x440044);
    this.gridHelper.material.opacity = 0.5;
    this.gridHelper.material.transparent = true;
    this.scene.add(this.gridHelper);
  }

  private createBars(): void {
    // Clear existing bars
    this.bars.forEach(bar => this.scene.remove(bar.mesh));
    this.bars = [];
    
    const { gridSize, barSpacing } = VISUALIZER_CONFIG;
    const barGeometry = new THREE.BoxGeometry(0.4, 1, 0.4);
    const totalBars = gridSize * gridSize;
    
    for (let i = 0; i < totalBars; i++) {
      const barMaterial = new THREE.MeshStandardMaterial();
      const bar = new VisualizerBar(barGeometry, barMaterial);
      
      // Position the bar
      const x = (i % gridSize - gridSize / 2 + 0.5) * barSpacing;
      const z = (Math.floor(i / gridSize) - gridSize / 2 + 0.5) * barSpacing;
      bar.mesh.position.set(x, 0.05, z);
      
      // Set initial scale
      bar.mesh.scale.y = 0.1;
      
      // Apply theme if available
      if (this.theme) {
        this.theme.applyToBar(bar, i, totalBars);
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
      this.updateBars(frequencyData);
    } else {
      this.decayBars();
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }

  private updateBars(frequencyData: Uint8Array): void {
    const numVisualBars = Math.min(this.bars.length, frequencyData.length);
    
    for (let i = 0; i < numVisualBars; i++) {
      const value = frequencyData[i] / 255;
      this.bars[i].update(value);
    }
  }

  private decayBars(): void {
    this.bars.forEach(bar => {
      if (bar.mesh.scale.y > 0.1) {
        bar.mesh.scale.y -= 0.02;
        bar.mesh.scale.y = Math.max(0.1, bar.mesh.scale.y);
        bar.mesh.position.y = bar.mesh.scale.y / 2;
      }
    });
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
    
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
      this.gridHelper = null;
    }
    
    this.renderer.dispose();
  }
}