import { ShapeFactory } from './webgl/ShapeFactory.js';
import { SceneManager } from './webgl/SceneManager.js';
import { gitTreeData } from './data/gitTreeData.js';
import * as THREE from 'three'

const canvas = document.getElementById('webgl-canvas');
const scenemanager = new SceneManager(canvas);
const shapeFactory = new ShapeFactory(scenemanager.getScene());



const treeMap = new Map();
gitTreeData.forEach(element => treeMap.set(element.id, element));

gitTreeData.forEach(element => {
  const positionA = new THREE.Vector3(element.position.x, element.position.y, element.position.z);
  
  let colorElementON = 0xFFFFFF;
  let colorElementOFF = 0xBDBDBD;
  switch (element.family) {
    case "Base": colorElementON = 0xFFFFFF; colorElementOFF = 0xFFFFFF; break;
    case "Competences": colorElementON = 0x45CDFF; colorElementOFF = 0x1C7FA3; break;
    case "Projets": colorElementON = 0x45FF6A; colorElementOFF = 0x24963B; break;
    case "Parcours": colorElementON = 0xECFF45; colorElementOFF = 0x929E26; break;
    case "Apropos": colorElementON = 0xFF6445; colorElementOFF = 0x9E3624; break;
    default: console.warn(`unknown family: ${element.family}`);
  }

  shapeFactory.create('cylinder', {position: positionA, radiusTop: 1, radiusBottom: 1, height: 1, radialSegments: 6, color: colorElementOFF, intensity: -0.2});

  element.children.forEach(childId => {
    const childElement = treeMap.get(childId);
    
    if (childElement) {
      const positionB = new THREE.Vector3(childElement.position.x, childElement.position.y, childElement.position.z);
      
      shapeFactory.create('cable', {p1: positionA, p2: positionB, radius: 0.1, color: colorElementOFF, intensity: 0});
    }
  });
});

scenemanager.render(() => {});