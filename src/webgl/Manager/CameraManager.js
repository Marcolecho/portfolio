import gsap from 'gsap';
import * as THREE from 'three';

export class CameraManager {
    constructor(camera, controls) {
        this.camera = camera
        this.controls = controls
    }

    focusOnNode(nodeMesh) {
        if (!nodeMesh || nodeMesh.userData.type != "leaf") return;

        const targetPosition = new THREE.Vector3();
        nodeMesh.getWorldPosition(targetPosition);

        const offset = new THREE.Vector3(-45, 50, 50); 
        const newCameraPosition = targetPosition.clone().add(offset);

        console.log(nodeMesh)

        gsap.to(this.controls.target, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1.5,
            ease: 'power3.inOut'
        });

        gsap.to(this.camera.position, {
            x: newCameraPosition.x,
            y: newCameraPosition.y,
            z: newCameraPosition.z,
            duration: 1.5,
            ease: 'power3.inOut',
            onUpdate: () => {
                this.controls.update();
            }
        });
    }
}



