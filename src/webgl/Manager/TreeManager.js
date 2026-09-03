import * as THREE from 'three'
import { gitTreeData } from '../../data/gitTreeData.js';
import { NodeElement } from '../../class/treeClass/NodeElement.js';
import { ShapeFactory } from '../ShapeFactory.js';
import { LinkElement } from '../../class/treeClass/LinkElement.js';
import gsap from 'gsap';

export class TreeManager {
    constructor(scene) {
        this.scene = scene;
        this.shapeFactory = new ShapeFactory(this.scene);
        this.listNodeElement = []
        this.listLinkElement = []
        this.intensityON = 2
        this.intensityOFF = 0.3
        this.baseColorElementON = 0xFFFFFF
        this.baseColorElementOFF = 0xBDBDBD
        this.currentHighlightedPath = []
        this.currentNodeId = null
    }

    createTree(){
        gitTreeData.forEach(element => {
            const positionElement = new THREE.Vector3(element.position.x, element.position.y, element.position.z);
            
            let colorElementON = this.baseColorElementON;
            let colorElementOFF = this.baseColorElementOFF;
            switch (element.family) {
                case "Base": colorElementON = 0xFFFFFF; colorElementOFF = 0xFFFFFF; break;
                case "Competences": colorElementON = 0x45CDFF; colorElementOFF = 0x1C7FA3; break;
                case "Projets": colorElementON = 0x45FF6A; colorElementOFF = 0x24963B; break;
                case "Parcours": colorElementON = 0xECFF45; colorElementOFF = 0x929E26; break;
                case "Apropos": colorElementON = 0xFF6445; colorElementOFF = 0x9E3624; break;
                default: console.warn(`unknown family: ${element.family}`);
            }

            let mesh;
            switch (element.type) {
                case "root": 
                    mesh = this.shapeFactory.create('root', {id: element.id, position: positionElement, radius: 1, height: 1, radialSegments: 6, color: colorElementON, intensity: this.intensityOFF}); 
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

            this.listNodeElement.push(new NodeElement(element.id, element.label ,element.type, positionElement, colorElementON, colorElementOFF, this.intensityON, this.intensityOFF, mesh));

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
        console.log(nodeSelected)
        if (nodeSelected.type === "root" || !nodeSelected.parents || nodeSelected.parents.length === 0) {
            return [nodeSelected];
        }
        const parentPaths = [];
 
        for (const parent of nodeSelected.parents) {
            const pathFromParent = this.pathFinder(parent, visited);
            parentPaths.push(...pathFromParent);
        }

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

        // Créer une copie ([...]) pour ne pas muter/inverser l'original à chaque appel
        const elementLight = [...this.currentHighlightedPath].reverse();

        elementLight.forEach((element) => {
            currentDelay += stepDelay;
            element.setGlow(true, currentDelay);
        });
    }

    highlightPathToNode(nodeSelected) { 
        if (!nodeSelected) {
            if (this.currentNodeId !== null) {
                this.resetHighlight();
                this.currentNodeId = null
            }
            return;
        } 

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
}


