import * as THREE from 'three'

import { NodeElement } from '../../class/treeClass/NodeElement.js';
import { ShapeFactory } from '../ShapeFactory.js';
import { LinkElement } from '../../class/treeClass/LinkElement.js';
import gsap from 'gsap';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class TreeManager {
    constructor(scene) {
        this.scene = scene;
        this.shapeFactory = new ShapeFactory(this.scene);
        this.listNodeElement = []
        this.listLinkElement = []
        this.intensityON = 1
        this.intensityOFF = 0.01
        this.baseColorElementON = 0x9E9E9E
        this.baseColorElementOFF = 0x9E9E9E
        this.currentHighlightedPath = []
        this.currentNodeId = null
        this.currentPopup = null
        this.activeNodeForPopup = null
        this.floatingtextObjects = [];
    }

    createTree(gitTreeData){
        gitTreeData.forEach(element => {
            const positionElement = new THREE.Vector3(element.position.x, element.position.y, element.position.z);
            
            let colorElementON = this.baseColorElementON;
            let colorElementOFF = this.baseColorElementOFF;
            switch (element.family) {
                case "Base": colorElementON = this.baseColorElementON; colorElementOFF = this.baseColorElementOFF; break;
                case "Competences": colorElementON = 0x45CDFF; colorElementOFF = 0x45CDFF; break; // 0x1C7FA3
                case "Projets": colorElementON = 0x45FF6A; colorElementOFF = 0x45FF6A; break; // 0x24963B
                case "Parcours": colorElementON = 0xECFF45; colorElementOFF = 0xECFF45; break; // 0x929E26
                case "Apropos": colorElementON = 0xFF6445; colorElementOFF = 0xFF6445; break; //0x9E3624
                default: console.warn(`unknown family: ${element.family}`);
            }

            let mesh;
            switch (element.type) {
                case "root": 
                    mesh = this.shapeFactory.create('root', {id: element.id, position: positionElement, radius: 1, height: 1, radialSegments: 6, color: colorElementOFF, intensity: this.intensityOFF}); 
                    break; 
                case "branch": 
                    mesh = this.shapeFactory.create('branch', {id: element.id, position: positionElement, radius: 1, height: 1, radialSegments: 6, color: colorElementOFF, intensity: this.intensityOFF}); 
                    break;
                case "leaf": 
                    mesh = this.shapeFactory.create('leaf', {id: element.id, position: positionElement, radius: 0.8, segments: 16, color: colorElementOFF, intensity: this.intensityOFF});
                    break;
                default: 
                    console.warn(`unknown family: ${element.family}`);
            }

            const nodeElement = new NodeElement(element.id, element.label, element.description, element.type, element.family, positionElement, colorElementON, colorElementOFF, this.intensityON, this.intensityOFF, mesh)
            this.listNodeElement.push(nodeElement);
            if(element.type == "branch"){
                this.floatingtextObjects.push(this.addFloatingTextOnElement(nodeElement))
            }
        });

        gitTreeData.forEach(parent => {
            const parentObj = this.listNodeElement.find(e => e.id == parent.id);
            parent.children.forEach((children) => {
                let mesh;
                const childrenObj = this.listNodeElement.find(e => e.id == children);
                if (childrenObj){
                    mesh = this.shapeFactory.create('cable', {p1: parentObj.positionOrigin, p2: childrenObj.positionOrigin, radius: 0.1, color: this.baseColorElementOFF, intensity: this.intensityOFF});
                    const cable = new LinkElement('cable', parentObj, childrenObj, this.baseColorElementON, this.baseColorElementOFF, this.intensityON, this.intensityOFF, mesh);
                    this.listLinkElement.push(cable);

                    parentObj.addChildren(childrenObj);
                    childrenObj.addParent(parentObj);
                }
            })
        });
        return [this.listNodeElement, this.listLinkElement]
    }

    pathFinder(nodeSelected, visited = new Set()) {
        if (!nodeSelected || visited.has(nodeSelected)) return [];
        
        visited.add(nodeSelected);
        if (nodeSelected.type === "root" || !nodeSelected.parent) {
            return [nodeSelected];
        }
        const parentPaths = [];
 
        const pathFromParent = this.pathFinder(nodeSelected.parent, visited);
        parentPaths.push(...pathFromParent);
        
        return [nodeSelected, ...parentPaths];
    }

    lightPath(listNodes) { 
        for (let i = 0; i < listNodes.length; i += 1) {
            const node = listNodes[i];
            
            this.currentHighlightedPath.push(node)
            

            if (i < listNodes.length - 1) {
                const linkToLight = this.listLinkElement.find(link => 
                    (link.NodeElement1 === listNodes[i] && link.NodeElement2 === listNodes[i + 1]) ||
                    (link.NodeElement1 === listNodes[i + 1] && link.NodeElement2 === listNodes[i])
                );

                if (linkToLight) {
                    this.currentHighlightedPath.push(linkToLight)
                }
            }
        }

        this.glowElement()
    }

    glowElement() {
        const stepDelay = 0.02;
        let currentDelay = 0;

        const elementLight = [...this.currentHighlightedPath].reverse();

        elementLight.forEach((element) => {
            currentDelay += stepDelay;
            element.setGlow(true, currentDelay);
        });
    }

    highlightPathToNode(nodeSelected) { 

        if (!nodeSelected && this.activeNodeForPopup == null) {
            if (this.currentNodeId !== null) {
                this.resetHighlight();
                this.currentNodeId = null
            }
            this.removePopup()
            document.body.style.cursor = "default"
            return;
        } 

        if(this.activeNodeForPopup != null){
            document.body.style.cursor = "default"
            if(this.activeNodeForPopup.id == this.currentNodeId) return
        }

        document.body.style.cursor = "pointer"
        const nodeObjSelected = this.listNodeElement.find(e => e.id == nodeSelected);
        if (!nodeObjSelected || nodeObjSelected.type !== "leaf") {
            if (this.currentNodeId !== null) {
                this.resetHighlight();
            }
            return;
        }

        if (this.currentNodeId === nodeObjSelected.id) {
            return; 
        }

        this.currentNodeId = nodeObjSelected.id;

        this.resetHighlight();

        const listElementToGlow = this.pathFinder(nodeObjSelected);
        this.lightPath(listElementToGlow);
    }



    resetHighlight() {
        this.currentHighlightedPath.forEach(node => {
            if (node.mesh && node.mesh.material) {
                gsap.killTweensOf(node.mesh.material);
                if (node.mesh.material.color) {
                    gsap.killTweensOf(node.mesh.material.color);
                }
                if (node.mesh.material.emissive) {
                    gsap.killTweensOf(node.mesh.material.emissive);
                }
            }

            node.setGlow(false, 0);
        });

        this.currentHighlightedPath = [];
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

    showPopupOnNode(nodeId) {
        const nodeObjSelected = this.listNodeElement.find(e => e.id == nodeId);
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

        if(this.activeNodeForPopup.id != this.currentNodeId){
            this.highlightPathToNode(this.activeNodeForPopup.id)
        }
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


