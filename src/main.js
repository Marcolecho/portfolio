import { SceneManager } from './webgl/Manager/SceneManager.js';
import { TreeManager } from './webgl/Manager/TreeManager.js';
import * as THREE from 'three'

const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const treeManager = new TreeManager(scene)
const sceneManager = new SceneManager(scene, canvas, (hoveredNode) => {
  treeManager.highlightPathToNode(hoveredNode);
});

const elements = treeManager.createTree()
//const element = elements[0][24]
//const pathLight = treeManager.pathFinder(element)
//treeManager.lightPath(pathLight.reverse())

sceneManager.render(() => {});