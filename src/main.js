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
  const positionElement = new THREE.Vector3(element.position.x, element.position.y, element.position.z);
  
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

  switch (element.type) {
    case "root": shapeFactory.create('cylinder', {position: positionElement, radiusTop: 1, radiusBottom: 1, height: 1, radialSegments: 6, color: colorElementON, intensity: 1});; break;
    case "branch": shapeFactory.create('cylinder', {position: positionElement, radiusTop: 1, radiusBottom: 1, height: 1, radialSegments: 6, color: colorElementON, intensity: 1});; break;
    case "leaf": shapeFactory.create('sphere', {position: positionElement, radius: 0.8, segments: 16, color: colorElementON, intensity: 1});; break;
    default: console.warn(`unknown family: ${element.family}`);
  }

  

  element.children.forEach(childId => {
    const childElement = treeMap.get(childId);
    
    if (childElement) {
      const positionB = new THREE.Vector3(childElement.position.x, childElement.position.y, childElement.position.z);
      
      shapeFactory.create('cable', {p1: positionElement, p2: positionB, radius: 0.1, color: 0xBDBDBD, intensity: 0});
    }
  });
});

scenemanager.render(() => {});