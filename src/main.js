import { SceneManager } from './webgl/Manager/SceneManager.js';
import { TreeManager } from './webgl/Manager/TreeManager.js';
import { gitTreeData } from './data/gitTreeData.js';
import * as THREE from 'three'
import { FileExplorerManager } from './webgl/Manager/FileExplorerManager.js';

const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

const treeManager = new TreeManager(scene)
const sceneManager = new SceneManager(scene, canvas, (hoveredNode) => {
  treeManager.highlightPathToNode(hoveredNode);
});

const elements = treeManager.createTree(gitTreeData)

const fileExplorerManager = new FileExplorerManager(elements[0], treeManager)
fileExplorerManager.createStructureFolder()
sceneManager.render(() => {});