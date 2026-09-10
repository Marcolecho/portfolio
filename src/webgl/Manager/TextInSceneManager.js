import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class TextInSceneManager {
    constructor(scene) {
        this.scene = scene;

        this.currentPopup = null
        this.activeNodeForPopup = null
        this.floatingtextObjects = [];
    }

    addFloatingTextOnElement(node) {
        const popupDiv = document.createElement('div');
        popupDiv.className = 'floatingText arrow-bottom-floatingText';
        popupDiv.innerHTML = `
            <div class="floatingText-wrapper">
                ${node.name}
            </div>
        `;

        const popupObject = new CSS2DObject(popupDiv);

        const boundingBox = new THREE.Box3().setFromObject(node.mesh);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const offsetY = size.y / 2 + 2;
        popupObject.position.set(0, offsetY, 0); 
        node.mesh.add(popupObject);
        node.mesh.updateMatrixWorld(true);

        return { mesh: node.mesh, popupDiv: popupDiv };
    }

    updateFloatingTextsProximity(camera) {
        const tempVector = new THREE.Vector3();

        this.floatingtextObjects.forEach(({ mesh, popupDiv }) => {
            mesh.getWorldPosition(tempVector);

            const distance = camera.position.distanceTo(tempVector);
            const scale = THREE.MathUtils.clamp(40 / distance, 0.6, 1.4);
            
            const opacity = THREE.MathUtils.clamp(1 - (distance - 50) / 80, 0, 1);

            popupDiv.style.transform = `translate(-50%, -50%) scale(${scale})`;
            popupDiv.style.opacity = opacity;
        });
    }



    showPopupOnNode(nodeId, listNodeElement) {
        const nodeObjSelected = listNodeElement.find(e => e.id == nodeId);
        if (!nodeObjSelected || nodeObjSelected.type !== "leaf") {

            this.removePopup();
            this.activeNodeForPopup = null;
            this.currentPopup = null;
            return;
        }

        this.removePopup();

        const popupDiv = document.createElement('div');
        popupDiv.className = 'popup';
        popupDiv.style.pointerEvents = 'auto';
        popupDiv.innerHTML = `
            <div class="popup-wrapper">
                <div class="popup-header">${nodeObjSelected.name}</div>
                <div class="popup-content">${nodeObjSelected.description}</div>
                <button class="popup-button"> Entrer </button>
            </div>
        `;

        const popupObject = new CSS2DObject(popupDiv);

        const boundingBox = new THREE.Box3().setFromObject(nodeObjSelected.mesh);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const offsetY = size.y / 2 + 4;
        popupObject.position.set(0, offsetY, 0); 
        nodeObjSelected.mesh.add(popupObject);
        nodeObjSelected.mesh.updateMatrixWorld(true);

        this.activeNodeForPopup = nodeObjSelected;
        this.currentPopup = popupObject;
    }

    removePopup() {
        if (!this.currentPopup) return;

        const popupToRemove = this.currentPopup;

        this.currentPopup = null;
        this.activeNodeForPopup = null;

        const popupDiv = popupToRemove.element;

        if (popupDiv) {
            const wrapper = popupDiv.querySelector('.popup-wrapper');

            if (wrapper) {
                popupDiv.classList.remove('arrow-bottom');
                wrapper.classList.add('is-closing');

                const onAnimationEnd = () => {
                    if (popupToRemove.parent) {
                        popupToRemove.parent.remove(popupToRemove);
                    } else {
                        this.scene.remove(popupToRemove);
                    }
                    popupDiv.remove();
                };

                wrapper.addEventListener('animationend', onAnimationEnd, { once: true });

                setTimeout(() => {
                    if (popupDiv.parentNode) {
                        onAnimationEnd();
                    }
                }, 300);

            } else {
                if (popupToRemove.parent) popupToRemove.parent.remove(popupToRemove);
                popupDiv.remove();
            }
        } else {
            if (popupToRemove.parent) popupToRemove.parent.remove(popupToRemove);
        }
    }
}


