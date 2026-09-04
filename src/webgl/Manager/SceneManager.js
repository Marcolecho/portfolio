import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export class SceneManager {
  constructor(scene, canvas, onNodeHover) {
    this.canvas = canvas;
    this.scene = scene;
    //this.scene.fog = new THREE.FogExp2(0x0a0a12, 0.025);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(-15, 17, 17); 

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 200;
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.maxPolarAngle = Math.PI / 3;
    this.controls.screenSpacePanning = false;

    const renderScene = new RenderPass(this.scene, this.camera);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.8, 0.05); // Résolution, Intensité, Rayon, Seuil

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const gridHelper = new THREE.GridHelper(10000, 10000, 0x444444, 0x222222);
    gridHelper.position.y = 0;

    gridHelper.material = new THREE.LineBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.3,
      toneMapped: false
    });

    gridHelper.material.toneMapped = false;
    this.scene.add(gridHelper);

    this.onNodeHover = onNodeHover; 
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('resize', () => this.onWindowResize());
    canvas.addEventListener('pointermove', (e) => this.onPointerMove(e)); // trouver un moyen de lock le chemin en surbrillance si cliqué (popup mission ouvert)
  }

  onPointerMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);

    if (intersects.length > 0) {
      const nodeElement = intersects[0].object.userData.id;
      this.onNodeHover(nodeElement);
    } else {
      this.onNodeHover(null); // Souris dans le vide -> désélection
    }
  }

  getScene() {
    return this.scene;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(updateCallback) {
    const animate = () => {
      requestAnimationFrame(animate);
      if (updateCallback) updateCallback();
      if (this.controls) this.controls.update();
      this.composer.render();
    };
    animate();
  }
}