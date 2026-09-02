import { SceneManager } from './webgl/Manager/SceneManager.js';
import { TreeManager } from './webgl/Manager/TreeManager.js';

const canvas = document.getElementById('webgl-canvas');
const scenemanager = new SceneManager(canvas);
const treeManager = new TreeManager(scenemanager.getScene())

const elements = treeManager.createTree()
const element = elements[0][6]
const pathLight = treeManager.pathFinder(element)
treeManager.lightPath(pathLight.reverse())

scenemanager.render(() => {});