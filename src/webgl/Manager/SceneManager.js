import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CameraManager } from './CameraManager.js'

export class SceneManager {
    constructor(scene, canvas, onNodeHover, clickNode) {
      this.canvas = canvas;
      this.scene = scene;
      // this.scene.fog = new THREE.FogExp2(0x0a0a12, 0.025);

      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(-45, 50, 50);

      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.className = 'css2d-container';
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0px';
      this.labelRenderer.domElement.style.left = '0px';
      this.labelRenderer.domElement.style.pointerEvents = 'none';
      
      this.canvas.parentElement.appendChild(this.labelRenderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = false;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.minDistance = 20; 
      this.controls.maxDistance = 200;
      this.controls.minPolarAngle = Math.PI / 4;
      this.controls.maxPolarAngle = Math.PI / 3;
      this.controls.screenSpacePanning = false;

      this.cameraManager = new CameraManager(this.camera, this.controls)

      // pour l'effet néon
      const renderScene = new RenderPass(this.scene, this.camera);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.8, 0.05);
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderScene);
      this.composer.addPass(bloomPass);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      this.scene.add(ambientLight);

      // Grille de fond
      const gridHelper = new THREE.GridHelper(10000, 10000, 0x444444, 0x222222);
      gridHelper.position.y = 0;
      gridHelper.material = new THREE.LineBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.3,
        toneMapped: false
      });
      this.scene.add(gridHelper);

      this.clickNode = clickNode
      this.onNodeHover = onNodeHover; 
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      window.addEventListener('resize', () => this.onWindowResize());
      canvas.addEventListener('pointermove', (e) => this.onPointerEvent(e, this.onNodeHover, 'pointermove'));
      canvas.addEventListener('click', (e) => this.onPointerEvent(e, this.clickNode, 'click'));
  }

  onPointerEvent(event, eventNode, typeEvent ) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);

    if (intersects.length > 0) {
      const nodeElement = intersects[0].object;
      const nodeElementId = nodeElement.userData.id
      eventNode(nodeElementId);
      if(typeEvent == 'click'){
        this.cameraManager.focusOnNode(nodeElement)
      }
    } else {
      eventNode(null); 
    }
  }

  getScene() {
    return this.scene;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(updateCallback) {
    const animate = () => {
      requestAnimationFrame(animate);
      if (updateCallback) updateCallback();
      if (this.controls) this.controls.update();
      this.composer.render();
      this.labelRenderer.render(this.scene, this.camera);
    };
    animate();
  }
}